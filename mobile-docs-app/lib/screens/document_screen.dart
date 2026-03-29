import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:go_router/go_router.dart';
import '../services/documentation_service.dart';
import '../models/document.dart';

class DocumentScreen extends StatelessWidget {
  final String docId;
  const DocumentScreen({super.key, required this.docId});

  @override
  Widget build(BuildContext context) {
    final docService = Provider.of<DocumentationService>(context);
    final document = docService.getDocumentById(docId);
    final theme = Theme.of(context);

    if (document == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Document Not Found')),
        body: const Center(child: Text('Document not found')),
      );
    }

    final isBookmarked = docService.isBookmarked(docId);
    final documents = docService.getDocumentsByFolder(document.folderId);
    final currentIndex = documents.indexWhere((d) => d.id == document.id);
    final prevDoc = currentIndex > 0 ? documents[currentIndex - 1] : null;
    final nextDoc = currentIndex < documents.length - 1 ? documents[currentIndex + 1] : null;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          document.title.length > 50 ? '${document.title.substring(0, 50)}...' : document.title,
          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(isBookmarked ? Icons.bookmark : Icons.bookmark_border),
            onPressed: () => docService.toggleBookmark(docId),
            tooltip: isBookmarked ? 'Remove bookmark' : 'Add bookmark',
          ),
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () => _shareDocument(document),
            tooltip: 'Share',
          ),
        ],
      ),
      body: Column(
        children: [
          // Header
          _buildHeader(context, document),
          const Divider(height: 1),
          // Content
          Expanded(
            child: Markdown(
              data: document.content,
              padding: const EdgeInsets.all(16),
              selectable: true,
            ),
          ),
          // Navigation
          if (prevDoc != null || nextDoc != null)
            _buildNavigation(context, prevDoc, nextDoc),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, Document document) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      color: theme.colorScheme.primaryContainer.withOpacity(0.3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            document.title,
            style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          if (document.subtitle.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              document.subtitle,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.7),
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            children: [
              _Chip(icon: Icons.access_time, label: '${document.readingTimeMinutes} min'),
              _Chip(icon: Icons.title, label: '${document.wordCount} words'),
              _Chip(icon: Icons.calendar_today, label: document.lastUpdated),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNavigation(BuildContext context, Document? prevDoc, Document? nextDoc) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(top: BorderSide(color: theme.colorScheme.outlineVariant)),
      ),
      child: Row(
        children: [
          if (prevDoc != null)
            Expanded(
              child: _NavButton(
                icon: Icons.arrow_back,
                label: 'Previous',
                title: prevDoc.title,
                onTap: () => context.push('/document/${Uri.encodeComponent(prevDoc.id)}'),
              ),
            ),
          if (prevDoc != null && nextDoc != null) const SizedBox(width: 8),
          if (nextDoc != null)
            Expanded(
              child: _NavButton(
                icon: Icons.arrow_forward,
                label: 'Next',
                title: nextDoc.title,
                onTap: () => context.push('/document/${Uri.encodeComponent(nextDoc.id)}'),
              ),
            ),
        ],
      ),
    );
  }

  Future<void> _shareDocument(Document document) async {
    final content = document.content.length > 500
        ? '${document.content.substring(0, 500)}...'
        : document.content;
    await Share.share(
      '${document.title}\n\n${document.subtitle}\n\n$content\n\n---\nRead full: Ujamaa DeFi Docs',
      subject: document.title,
    );
  }
}

class _Chip extends StatelessWidget {
  final IconData icon;
  final String label;
  const _Chip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.primaryContainer,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12),
          const SizedBox(width: 4),
          Text(label, style: Theme.of(context).textTheme.labelSmall),
        ],
      ),
    );
  }
}

class _NavButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final String title;
  final VoidCallback onTap;
  const _NavButton({
    required this.icon,
    required this.label,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 14),
                const SizedBox(width: 4),
                Text(label, style: Theme.of(context).textTheme.labelSmall),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              title.length > 25 ? '${title.substring(0, 25)}...' : title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
