import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../services/documentation_service.dart';
import '../widgets/folder_card.dart';
import '../widgets/custom_search_bar.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final docService = Provider.of<DocumentationService>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ujamaa DeFi Docs'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => context.push('/search'),
          ),
          IconButton(
            icon: const Icon(Icons.bookmark_border),
            onPressed: () => context.push('/bookmarks'),
          ),
        ],
      ),
      body: Column(
        children: [
          const CustomSearchBar(),
          Expanded(
            child: docService.isLoading
                ? const Center(child: CircularProgressIndicator())
                : docService.hasError
                    ? _buildErrorState(docService)
                    : _buildFolderGrid(docService),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(DocumentationService docService) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.grey.shade400),
            const SizedBox(height: 16),
            Text(
              'Error Loading Documentation',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              docService.error ?? 'Unknown error',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => docService.initialize(),
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFolderGrid(DocumentationService docService) {
    return RefreshIndicator(
      onRefresh: () async {
        await docService.initialize();
      },
      child: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.85,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: docService.folders.length,
        itemBuilder: (context, index) {
          final folder = docService.folders[index];
          return FolderCard(folder: folder);
        },
      ),
    );
  }
}
