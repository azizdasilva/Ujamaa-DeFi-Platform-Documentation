import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../services/documentation_service.dart';
import '../widgets/document_card.dart';

class BookmarksScreen extends StatelessWidget {
  const BookmarksScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final docService = Provider.of<DocumentationService>(context);
    final bookmarks = docService.bookmarkedDocuments;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bookmarks'),
        actions: [
          if (bookmarks.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.bookmark_remove),
              onPressed: () => _clearAllBookmarks(context, docService),
              tooltip: 'Clear all bookmarks',
            ),
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => GoRouter.of(context).push('/search'),
            tooltip: 'Search',
          ),
        ],
      ),
      body: bookmarks.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: bookmarks.length,
              itemBuilder: (context, index) {
                final document = bookmarks[index];
                return DocumentCard(document: document);
              },
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.bookmark_border, size: 64, color: Colors.grey.shade400),
          const SizedBox(height: 16),
          const Text(
            'No Bookmarks Yet',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Save documents to read them later',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade600,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _clearAllBookmarks(
    BuildContext context,
    DocumentationService docService,
  ) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear All Bookmarks?'),
        content: const Text('This will remove all your saved bookmarks.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Clear All'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final bookmarkedDocs = docService.bookmarkedDocuments;
      for (final doc in bookmarkedDocs) {
        docService.toggleBookmark(doc.id);
      }
    }
  }
}
