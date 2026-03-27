import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CustomSearchBar extends StatelessWidget {
  const CustomSearchBar({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Card(
        elevation: 0,
        shadowColor: isDark ? Colors.black26 : Colors.black12,
        child: InkWell(
          onTap: () => context.push('/search'),
          borderRadius: BorderRadius.circular(14),
          splashColor: theme.colorScheme.primaryContainer.withOpacity(0.2),
          highlightColor: theme.colorScheme.primaryContainer.withOpacity(0.1),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? AppTheme.slate800 : AppTheme.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isDark ? AppTheme.slate700 : AppTheme.slate200,
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    gradient: AppTheme.primaryGradient,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.search_rounded,
                    color: AppTheme.white,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Search documentation...',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: isDark ? AppTheme.slate400 : AppTheme.slate500,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Search 151 documents',
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: isDark ? AppTheme.slate500 : AppTheme.slate400,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  decoration: BoxDecoration(
                    color: isDark
                        ? theme.colorScheme.primaryContainer.withOpacity(0.2)
                        : AppTheme.primary50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isDark
                          ? theme.colorScheme.primaryContainer
                          : AppTheme.primary.withOpacity(0.2),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.keyboard_rounded,
                        size: 14,
                        color: isDark
                            ? theme.colorScheme.primary
                            : AppTheme.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'K',
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: isDark
                              ? theme.colorScheme.primary
                              : AppTheme.primary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
