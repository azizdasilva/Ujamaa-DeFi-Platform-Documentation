import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../services/documentation_service.dart';
import '../widgets/document_card.dart';

class FolderScreen extends StatelessWidget {
  final String folderId;
  const FolderScreen({super.key, required this.folderId});

  @override
  Widget build(BuildContext context) {
    final docService = Provider.of<DocumentationService>(context);
    final folder = docService.getFolderById(folderId);
    final documents = docService.getDocumentsByFolder(folderId);
    final theme = Theme.of(context);

    if (folder == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Folder Not Found')),
        body: const Center(child: Text('Folder not found')),
      );
    }

    final docCount = (folder['document_count'] as int?) ?? 0;
    final folderIcon = folder['icon'] ?? '📁';
    final folderName = folder['name'] ?? 'Folder';

    return Scaffold(
      appBar: AppBar(
        title: Text(folderName, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => context.push('/search'),
            tooltip: 'Search',
          ),
        ],
      ),
      body: Column(
        children: [
          // Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            color: theme.colorScheme.primaryContainer,
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(folderIcon, style: const TextStyle(fontSize: 28)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        folderName,
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onPrimaryContainer,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '$docCount documents',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onPrimaryContainer.withOpacity(0.7),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Documents
          Expanded(
            child: documents.isEmpty
                ? const Center(child: Text('No documents in this folder'))
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: documents.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      return DocumentCard(document: documents[index]);
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
