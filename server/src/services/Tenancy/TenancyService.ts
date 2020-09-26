import { Container, Service, Inject } from 'typedi';
import TenantsManagerService from 'services/Tenancy/TenantsManager';
import tenantModelsLoader from 'loaders/tenantModels';
import tenantRepositoriesLoader from 'loaders/tenantRepositories';
import tenantCacheLoader from 'loaders/tenantCache';

@Service()
export default class HasTenancyService {
  @Inject()
  tenantsManager: TenantsManagerService;

  /**
   * Retrieve the given tenant container.
   * @param  {number} tenantId 
   * @return {Container}
   */
  tenantContainer(tenantId: number) {
    return Container.of(`tenant-${tenantId}`);
  }

  /**
   * Singleton tenant service.
   * @param {number} tenantId - Tenant id.
   * @param {string} key - Service key.
   * @param {Function} callback 
   */
  singletonService(tenantId: number, key: string, callback: Function) {
    const container = this.tenantContainer(tenantId);
    const Logger = Container.get('logger');

    const hasServiceInstnace = container.has(key);

    if (!hasServiceInstnace) {
      const serviceInstance = callback();

      container.set(key, serviceInstance);
      Logger.info(`[tenant_DI] ${key} injected to tenant container.`, { tenantId, key });

      return serviceInstance;
    } else {
      return container.get(key);
    }
  }

  /**
   * Retrieve knex instance of the given tenant id.
   * @param {number} tenantId 
   */
  knex(tenantId: number) {
    return this.singletonService(tenantId, 'tenantManager', () => {
      return this.tenantsManager.getKnexInstance(tenantId);
    });
  }

  /**
   * Retrieve models of the givne tenant id. 
   * @param {number} tenantId - The tenant id.
   */
  models(tenantId: number) {
    const knexInstance = this.knex(tenantId);

    return this.singletonService(tenantId, 'models', () => {
      return tenantModelsLoader(knexInstance);
    });
  }

  /**
   * Retrieve repositories of the given tenant id.
   * @param {number} tenantId - Tenant id.
   */
  repositories(tenantId: number) {
    return this.singletonService(tenantId, 'repositories', () => {
      return tenantRepositoriesLoader(tenantId);
    });
  }

  /**
   * Retrieve i18n locales methods.
   * @param {number} tenantId - Tenant id.
   */
  i18n(tenantId: number) {
    return this.singletonService(tenantId, 'i18n', () => {
    });
  }

  /**
   * Retrieve tenant cache instance.
   * @param {number} tenantId - Tenant id.
   */
  cache(tenantId: number) {
    return this.singletonService(tenantId, 'cache', () => {
      return tenantCacheLoader(tenantId);
    });
  }
}