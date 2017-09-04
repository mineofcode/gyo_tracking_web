/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All href attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: 'msapplication-TileImage', content: '/assets/icon/ms-icon-144x144.png', '=content': true },
 * Will prefix the publicPath to content.
 *
 * { rel: 'apple-touch-icon', sizes: '57x57', href: '/assets/icon/apple-icon-57x57.png', '=href': false },
 * Will not prefix the publicPath on href (href attributes are added by default
 *
 */
var cssver = 24;
var conf = {
    link: [
        /** <link> tags for 'apple-touch-icon' (AKA Web Clips). **/
        // { rel: 'apple-touch-icon', sizes: '57x57', href: '/assets/icon/apple-icon-57x57.png' },
        // { rel: 'apple-touch-icon', sizes: '60x60', href: '/assets/icon/apple-icon-60x60.png' },
        // { rel: 'apple-touch-icon', sizes: '72x72', href: '/assets/icon/apple-icon-72x72.png' },
        // { rel: 'apple-touch-icon', sizes: '76x76', href: '/assets/icon/apple-icon-76x76.png' },
        // { rel: 'apple-touch-icon', sizes: '114x114', href: '/assets/icon/apple-icon-114x114.png' },
        // { rel: 'apple-touch-icon', sizes: '120x120', href: '/assets/icon/apple-icon-120x120.png' },
        // { rel: 'apple-touch-icon', sizes: '144x144', href: '/assets/icon/apple-icon-144x144.png' },
        // { rel: 'apple-touch-icon', sizes: '152x152', href: '/assets/icon/apple-icon-152x152.png' },
        // { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/icon/apple-icon-180x180.png' },

        { rel: 'stylesheet', href: 'assets/css/bootstrap.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/multi-select.css' },
        { rel: 'stylesheet', href: 'assets/css/login.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/waves.css' },
        { rel: 'stylesheet', href: 'assets/css/animate.css' },
        { rel: 'stylesheet', href: 'assets/css/morris.css' },
        { rel: 'stylesheet', href: 'assets/css/datatable.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/style.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/partial_style.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/font-awesome.min.css' },
        { rel: 'stylesheet', href: 'assets/css/fullcalendar.min.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/all-themes.css?v=' + cssver },
        /** <link> tags for android web app icons **/
        // { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/assets/icon/android-icon-192x192.png' },

        /** <link> tags for favicons **/
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/img/fav.png' },
        // { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/assets/icon/favicon-96x96.png' },
        // { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/icon/favicon-16x16.png' },

        /** <link> tags for a Web App Manifest **/
        // { rel: 'manifest', href: '/assets/manifest.json' }
    ],
    meta: [
        { name: 'msapplication-TileColor', content: '#00bcd4' },
        { name: 'msapplication-TileImage', content: '/assets/img/fav.png', '=content': true },
        { name: 'theme-color', content: '#00bcd4' }
    ]
};


module.exports = conf;