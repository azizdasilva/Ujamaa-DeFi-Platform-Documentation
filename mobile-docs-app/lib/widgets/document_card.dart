import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/document.dart';

class DocumentCard extends StatelessWidget {
  final Document document;

  const DocumentCard({super.key, required this.document});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => context.push('/document/${document.id}'),
        borderRadius: BorderRadius.circular(16),
        splashColor: theme.colorScheme.primaryContainer,
        highlightColor: theme.colorScheme.primaryContainer.withOpacity(0.3),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title with icon
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: isDark
                          ? theme.colorScheme.primaryContainer.withOpacity(0.2)
                          : AppTheme.primary50,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.description_rounded,
                      color: isDark
                          ? theme.colorScheme.primary
                          : AppTheme.primary,
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      document.title,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.2,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 10),
              
              // Subtitle
              if (document.subtitle.isNotEmpty)
                Text(
                  document.subtitle,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: isDark ? AppTheme.slate400 : AppTheme.slate500,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              
              const SizedBox(height: 14),
              
              // Metadata row
              Row(
                children: [
                  // Reading time
                  _MetadataChip(
                    icon: Icons.access_time_rounded,
                    label: '${document.readingTimeMinutes} min',
                  ),
                  const SizedBox(width: 8),
                  // Word count
                  _MetadataChip(
                    icon: Icons.word_rounded,
                    label: '${document.wordCount}',
                  ),
                  const Spacer(),
                  // Chevron
                  Icon(
                    Icons.chevron_right_rounded,
                    color: theme.colorScheme.primary,
                    size: 24,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MetadataChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _MetadataChip({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isDark
            ? theme.colorScheme.surfaceContainerHighest
            : AppTheme.slate100,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: isDark ? AppTheme.slate400 : AppTheme.slate500,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: theme.textTheme.labelSmall?.copyWith(
              color: isDark ? AppTheme.slate400 : AppTheme.slate500,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
