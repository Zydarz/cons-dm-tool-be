export const Routes = {
  'Resources Project': [
    {
      name: 'Add Resource Project',
      path: '/api/v1/resources',
      method: 'post',
    },
    {
      name: 'Update Resource Project',
      path: '/api/v1/resources/:userId/project/:projectId',
      method: 'put',
    },
    {
      name: 'List Project Resources Project',
      path: '/api/v1/resources/list-project',
      method: 'get',
    },
    {
      name: 'List User',
      path: '/api/v1/resources/list-user',
      method: 'get',
    },
    {
      name: 'Delete Resources Project',
      path: '/api/v1/resources/:userId/project/:projectId',
      method: 'delete',
    },
    {
      name: 'Delete All Resources Member',
      path: '/api/v1/projects/:projectId/user/:userId',
      method: 'delete',
    },
    {
      name: 'List Resources',
      path: '/api/v1/resources/projects',
      method: 'get',
    },
  ],
  'Resources Member': [
    {
      name: 'Add Resource Member',
      path: '/api/v1/resources/member',
      method: 'post',
    },
    {
      name: 'Update Resource Member',
      path: '/api/v1/resources/:userId/member/:projectId',
      method: 'put',
    },
    {
      name: 'List Project Resources Member',
      path: '/api/v1/resources/list-project',
      method: 'get',
    },
    {
      name: 'List User',
      path: '/api/v1/resources/list-user',
      method: 'get',
    },
    {
      name: 'Delete Resources Member',
      path: '/api/v1/resources/:userId/member/:projectId',
      method: 'delete',
    },
    {
      name: 'Delete All Resources Member',
      path: '/api/v1/resources/:projectId/user/:userId',
      method: 'delete',
    },
    {
      name: 'List Resources',
      path: '/api/v1/resources/users',
      method: 'get',
    },
  ],
  'Resources Summary': [
    {
      name: 'Get User Resource Summary',
      path: '/api/v1/resources/user-summary',
      method: 'get',
    },
    {
      name: 'Get User Resource Detail',
      path: '/api/v1/resources/user-summary/:id',
      method: 'get',
    },
    {
      name: 'List Resources User',
      path: '/api/v1/resources/users/summary',
      method: 'get',
    },
    {
      name: 'Send Project To Team',
      path: '/api/v1/resources/send-project-to-team',
      method: 'post',
    },
  ],
  'Project List': [
    {
      name: 'List Project',
      path: '/api/v1/projects',
      method: 'get',
    },
    {
      name: 'Add Project',
      path: '/api/v1/projects',
      method: 'post',
    },
    {
      name: 'List Customer',
      path: '/api/v1/projects/customer',
      method: 'get',
    },
  ],
  'Project Detail': [
    {
      name: 'Detail Project Information',
      path: '/api/v1/projects/information-project',
      method: 'get',
    },
    {
      name: 'Detail Project',
      path: '/api/v1/projects/:id',
      method: 'get',
    },
    {
      name: 'Edit Project',
      path: '/api/v1/projects/:id',
      method: 'put',
    },
    {
      name: 'Project Resource Allocation',
      path: '/api/v1/projects/resource-summaries',
      method: 'get',
    },
    {
      name: 'Edit Committed',
      path: '/api/v1/resource-summaries/edit_committed',
      method: 'post',
    },
  ],
  'Project Detail Situation': [
    {
      name: 'Project Situations List',
      path: '/api/v1/project-situations',
      method: 'get',
    },
    {
      name: 'Add Project Situation',
      path: '/api/v1/projects/create_project_situation',
      method: 'post',
    },
    {
      name: 'Edit_Project_Situation',
      path: '/api/v1/projects/edit_project_situation',
      method: 'post',
    },
    {
      name: 'Delete Project Situations',
      path: '/api/v1/projects/delete_project_situation',
      method: 'post',
    },
  ],
  'Project Detail Reources': [
    {
      name: 'Get Project Resource',
      path: '/api/v1/projects/resources',
      method: 'get',
    },
  ],
  'Project Detail Daily': [
    {
      name: 'List_Log_Work',
      path: '/api/v1/projects/:id/log-works',
      method: 'get',
    },
    {
      name: 'Add Log Work',
      path: '/api/v1/projects/:id/log-works',
      method: 'post',
    },
    {
      name: 'Update Log Work',
      path: '/api/v1/projects/log-works/:id',
      method: 'put',
    },
    {
      name: 'Detail Log Work',
      path: '/api/v1/projects/log-works/:id',
      method: 'get',
    },
    {
      name: 'Delete Log Work',
      path: '/api/v1/projects/log-works/:id',
      method: 'delete',
    },
  ],
  'Project Detail Payment': [
    {
      name: 'List Payment By ProjectId',
      path: '/api/v1/payment_tracking/:projectId',
      method: 'get',
    },
    {
      name: 'List Payment Tracking',
      path: '/api/v1/payment_tracking/list',
      method: 'get',
    },
    {
      name: 'Add Payment',
      path: '/api/v1/projects/payment',
      method: 'post',
    },
    {
      name: 'Edit Payment',
      path: '/api/v1/projects/payment/:id',
      method: 'put',
    },
    {
      name: 'Delete Payment',
      path: '/api/v1/projects/payment/:id',
      method: 'delete',
    },
  ],
  'Project Payment': [
    {
      name: 'Get filter Payment Summary',
      path: '/api/v1/payment_tracking/summary',
      method: 'get',
    },
    {
      name: 'Add Payment',
      path: '/api/v1/payment_tracking',
      method: 'post',
    },
    {
      name: 'Edit Payment',
      path: '/api/v1/payment_tracking/:id',
      method: 'put',
    },
    {
      name: 'Delete Payment',
      path: '/api/v1/payment_tracking/:id',
      method: 'delete',
    },
  ],
  'Project Situation': [
    {
      name: 'Get filter Project Situation',
      path: '/api/v1/project-situations/filter-group',
      method: 'get',
    },
    {
      name: 'Add Project Situation',
      path: '/api/v1/project-situations/create_project_situation',
      method: 'post',
    },
    {
      name: 'Edit Project Situation',
      path: '/api/v1/project-situations/edit_project_situation',
      method: 'post',
    },
    {
      name: 'Delete Project Situation',
      path: '/api/v1/project-situations/delete_project_situation',
      method: 'post',
    },
  ],
  'Member ': [
    {
      name: 'List Member',
      path: '/api/v1/users/division',
      method: 'get',
    },
    {
      name: 'Create Member',
      path: '/api/v1/users',
      method: 'post',
    },
    {
      name: 'Edit Member',
      path: '/api/v1/users/:id',
      method: 'put',
    },
    {
      name: 'Edit Member By Email',
      path: '/api/v1/users/update/:email',
      method: 'get',
    },
  ],
  'Customer ': [
    {
      name: 'List Customer',
      path: '/api/v1/customers',
      method: 'get',
    },
    {
      name: 'Create Customer',
      path: '/api/v1/customers',
      method: 'post',
    },
    {
      name: 'Edit Customer',
      path: '/api/v1/customers/:id',
      method: 'put',
    },
    {
      name: 'Delete Customer',
      path: '/api/v1/customers/:id',
      method: 'delete',
    },
    {
      name: 'Customer Detail',
      path: 'api/v1/customers/:customerId/projects',
      method: 'get',
    },
  ],
  'Days Off': [
    {
      name: 'List Days Off',
      path: '/api/v1/days-off',
      method: 'get',
    },
    {
      name: 'Create Days Off',
      path: '/api/v1/days-off',
      method: 'post',
    },
    {
      name: 'Update Days Off',
      path: '/api/v1/days-off/:id',
      method: 'put',
    },
    {
      name: 'Delete Days Off',
      path: '/api/v1/days-off/:id',
      method: 'delete',
    },
    {
      name: 'Update Resources',
      path: '/api/v1/resources/update-rs-daysoff',
      method: 'get',
    },
  ],
  'Department ': [
    {
      name: 'Get Department',
      path: '/api/v1/master-data/department',
      method: 'get',
    },
    {
      name: 'Create Department',
      path: '/api/v1/master-data/department',
      method: 'post',
    },
    {
      name: 'Update Department',
      path: '/api/v1/master-data/department/:id',
      method: 'put',
    },
    {
      name: 'Delete Department',
      path: '/api/v1/master-data/department/:id',
      method: 'delete',
    },
  ],
  'Master Data ': [
    {
      name: 'Get Master Data',
      path: '/api/v1/master-data/list-master-data/:type',
      method: 'get',
    },
    {
      name: 'Handle Master Data',
      path: '/api/v1/master-data/handle-master-data',
      method: 'post',
    },
    {
      name: 'Summary Master Data',
      path: '/api/v1/master-data/master-data-summary',
      method: 'get',
    },
  ],
  'Role ': [
    {
      name: 'Get Routes',
      path: '/api/v1/role/routes',
      method: 'get',
    },
    {
      name: 'Get Role',
      path: '/api/v1/role',
      method: 'get',
    },
    {
      name: 'Get Permission By Role',
      path: '/api/v1/role/:id/permission',
      method: 'get',
    },
    {
      name: 'Create Permission',
      path: '/api/v1/role',
      method: 'post',
    },
    {
      name: 'Update Permission',
      path: '/api/v1/role/:id',
      method: 'put',
    },
    {
      name: 'Delete Permission',
      path: '/api/v1/role/:id',
      method: 'delete',
    },
  ],
};
