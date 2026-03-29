import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class FolderCard extends StatelessWidget {
  final Map<String, dynamic> folder;
  const FolderCard({super.key, required this.folder});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final docCount = (folder['document_count'] as int?) ?? 0;

    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () => context.push('/folder/${folder['id']}'),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                theme.colorScheme.primaryContainer,
                theme.colorScheme.surface,
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: Text(folder['icon'] ?? '📁', style: const TextStyle(fontSize: 24)),
                ),
              ),
              const Spacer(),
              // Name
              Text(
                folder['name'] ?? 'Folder',
                style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              // Count
              Row(
                children: [
                  Icon(Icons.description, size: 12, color: theme.colorScheme.primary),
                  const SizedBox(width: 4),
                  Text('$docCount', style: theme.textTheme.labelSmall),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
