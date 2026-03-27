import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/folder.dart';

class FolderCard extends StatelessWidget {
  final Folder folder;

  const FolderCard({super.key, required this.folder});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.push('/folder/${folder.id}'),
        splashColor: theme.colorScheme.primaryContainer,
        highlightColor: theme.colorScheme.primaryContainer.withOpacity(0.3),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: isDark
                  ? [
                      theme.colorScheme.surface,
                      theme.colorScheme.surfaceContainerHighest,
                    ]
                  : [
                      theme.colorScheme.primaryContainer.withOpacity(0.3),
                      theme.colorScheme.surface,
                    ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon with subtle shadow
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primary.withOpacity(0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    folder.icon,
                    style: const TextStyle(fontSize: 32),
                  ),
                ),
              ),
              
              const Spacer(),
              
              // Folder Info
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    folder.name,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: isDark
                          ? theme.colorScheme.primaryContainer.withOpacity(0.2)
                          : AppTheme.primary50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.description_rounded,
                          size: 14,
                          color: isDark
                              ? theme.colorScheme.primary
                              : AppTheme.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${folder.documentCount}',
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: isDark
                                ? theme.colorScheme.primary
                                : AppTheme.primary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
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
