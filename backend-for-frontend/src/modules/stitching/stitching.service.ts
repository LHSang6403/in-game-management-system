import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { stitchSchemas } from '@graphql-tools/stitch';
import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';
import { wrapSchema } from '@graphql-tools/wrap';
import fetch from 'cross-fetch';
import { GraphQLError, print, GraphQLSchema } from 'graphql';

@Injectable()
export class StitchingService implements OnModuleInit {
  private readonly logger = new Logger(StitchingService.name);
  public mergedSchema = undefined;

  async onModuleInit() {
    this.logger.log('Starting schema stitching process...');

    const services = [
      {
        name: 'Auth',
        url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/graphql',
      },
      {
        name: 'Item Catalog',
        url:
          process.env.ITEM_CATALOG_SERVICE_URL ||
          'http://localhost:3002/graphql',
      },
      {
        name: 'Transaction',
        url:
          process.env.TRANSACTION_SERVICE_URL ||
          'http://localhost:3003/graphql',
      },
      {
        name: 'Inventory',
        url:
          process.env.INVENTORY_SERVICE_URL || 'http://localhost:3004/graphql',
      },
    ];

    try {
      this.mergedSchema = await this.createMergedSchema(services);
      this.logger.log('Schema stitching completed successfully!');
    } catch (error) {
      this.logger.error(`Error during schema stitching: ${error.message}`);
    }
  }

  private async createMergedSchema(services: { name: string; url: string }[]) {
    const schemas = await Promise.all(
      services.map((service) => this.retryLoadSchema(service, 3)),
    );

    const validSchemas = schemas.filter((schema) => schema !== null);

    if (validSchemas.length === 0) {
      this.logger.error('No valid schemas available for stitching.');
      throw new Error('No valid schemas available for stitching.');
    }

    if (!validSchemas.some((s) => s.getQueryType())) {
      this.logger.error('No services provided a valid Query root type.');
      throw new Error('No services provided a valid Query root type.');
    }

    const mergedSchema = stitchSchemas({
      subschemas: validSchemas,
      typeDefs: `
          extend type Query {
            _empty: String
          }
        `,
    });

    this.logger.log('Merged schema created successfully:', mergedSchema);

    return mergedSchema;
  }

  private async retryLoadSchema(
    service: { name: string; url: string },
    retries: number,
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        this.logger.log(
          `Fetching schema from ${service.name} (${service.url})... [Attempt ${i + 1}]`,
        );
        const schema = await this.makeRemoteSchema(service.url);
        this.logger.log(`Successfully loaded schema for ${service.name}`);
        return schema;
      } catch (error) {
        this.logger.warn(
          `Failed to load schema for ${service.name} (Attempt ${i + 1}): ${error.message}`,
        );
      }
    }
    this.logger.error(
      `Giving up on ${service.name}, all ${retries} attempts failed.`,
    );
    return null;
  }

  private async makeRemoteSchema(uri: string): Promise<GraphQLSchema> {
    try {
      const schema = await loadSchema(uri, { loaders: [new UrlLoader()] });

      const executor = async ({ document, variables, context }: any) => {
        try {
          const query = print(document);
          this.logger.log(`Executing query on ${uri}:`, query);

          const fetchResult = await fetch(uri, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: context.req?.headers['authorization'] || '',
            },
            body: JSON.stringify({ query, variables }),
          });

          const json = await fetchResult.json();
          if (json.errors) {
            this.logger.error(`Errors from ${uri}:`, json.errors);
          }

          return json;
        } catch (error) {
          this.logger.error(`Error executing query on ${uri}:`, error.message);
          return { errors: [new GraphQLError(error.message)] };
        }
      };

      return wrapSchema({ schema, executor });
    } catch (error) {
      this.logger.error(`Failed to load schema from ${uri}: ${error.message}`);
      throw error;
    }
  }
}
