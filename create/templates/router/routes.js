const routes = [
    {
        path: '/',
        component: 'template-component',
        import: () => import('./template-component.js'),
    },
    {
        path: 'info',
        component: 'info-view',
        import: () => import('./info-view.js'),
    },
];
export default routes;
