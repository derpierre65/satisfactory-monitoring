import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'dashboard',
        path: '',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
      {
        name: 'power',
        path: 'power',
        component: () => import('pages/PowerPage.vue'),
      },
      {
        name: 'sink',
        path: 'sink',
        component: () => import('pages/SinkPage.vue'),
      },
      {
        name: 'map',
        path: 'map',
        component: () => import('pages/MapPage.vue'),
      },
      {
        path: 'factory',
        component: () => import('pages/factory/FactoryPage.vue'),
        children: [
          {
            name: 'factory-efficiency',
            path: 'efficiency',
            component: () => import('pages/factory/FactoryEfficiencyPage.vue'),
          },
        ],
        meta: {
          noPadding: true,
        },
      },
      {
        path: 'vehicle',
        component: () => import('pages/vehicle/VehicleIndexPage.vue'),
        children: [
          {
            name: 'vehicle-cars',
            path: 'cars',
            component: () => import('pages/vehicle/VehicleCarsPage.vue'),
          },
          {
            name: 'vehicle-drones',
            path: 'drones',
            component: () => import('pages/vehicle/VehicleDronesPage.vue'),
          },
          {
            name: 'vehicle-trains',
            path: 'trains',
            component: () => import('pages/vehicle/VehicleTrainsPage.vue'),
          },
        ],
        meta: {
          noPadding: true,
        },
      },
      {
        path: 'inventory',
        component: () => import('pages/inventory/InventoryIndexPage.vue'),
        children: [
          {
            name: 'inventory',
            path: '',
            component: () => import('pages/inventory/InventoryPage.vue'),
          },
          {
            name: 'inventory-items',
            path: 'items',
            component: () => import('pages/inventory/InventoryItemsPage.vue'),
          },
        ],
        meta: {
          noPadding: true,
        },
      },
      {
        name: 'power-switches',
        path: 'power-switches',
        component: () => import('pages/PowerSwitchesPage.vue'),
      },
      {
        name: 'test',
        path: 'test',
        component: () => import('pages/TestPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
