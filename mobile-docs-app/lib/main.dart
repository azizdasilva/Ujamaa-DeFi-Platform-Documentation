import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'screens/home_screen.dart';
import 'screens/folder_screen.dart';
import 'screens/document_screen.dart';
import 'screens/search_screen.dart';
import 'screens/bookmarks_screen.dart';
import 'services/documentation_service.dart';
import 'utils/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize documentation service
  final docService = DocumentationService();
  await docService.initialize();

  runApp(UjamaaDocsApp(docService: docService));
}

class UjamaaDocsApp extends StatelessWidget {
  final DocumentationService docService;

  const UjamaaDocsApp({super.key, required this.docService});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider.value(value: docService),
      ],
      child: MaterialApp.router(
        title: 'Ujamaa DeFi Documentation',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        themeMode: ThemeMode.system,
        routerConfig: router,
      ),
    );
  }

  static GoRouter get router => _router;
  static final _router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/folder/:folderId',
        builder: (context, state) => FolderScreen(
          folderId: state.pathParameters['folderId']!,
        ),
      ),
      GoRoute(
        path: '/document/:docId',
        builder: (context, state) => DocumentScreen(
          docId: Uri.decodeComponent(state.pathParameters['docId']!),
        ),
      ),
      GoRoute(
        path: '/search',
        builder: (context, state) => const SearchScreen(),
      ),
      GoRoute(
        path: '/bookmarks',
        builder: (context, state) => const BookmarksScreen(),
      ),
    ],
  );
}
