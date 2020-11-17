const routes = [
    {
        path: '/',
        component: 'matiaksen-demo',
        import: () => import('./matiaksen-demo.js'),
    },
    {
        path: 'info',
        component: 'info-view',
        import: () => import('./info-view.js'),
    },
];
export default routes;
