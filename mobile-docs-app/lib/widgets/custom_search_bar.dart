import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Brand Colors
const _primary = Color(0xFF2563EB);
const _primary50 = Color(0xFFEFF6FF);
const _slate200 = Color(0xFFE2E8F0);
const _slate400 = Color(0xFF94A3B8);
const _slate500 = Color(0xFF64748B);
const _slate700 = Color(0xFF334155);
const _slate800 = Color(0xFF1E293B);
const _white = Color(0xFFFFFFFF);

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
          onTap: () {
            GoRouter.of(context).push('/search');
          },
          borderRadius: BorderRadius.circular(14),
          splashColor: theme.colorScheme.primaryContainer.withOpacity(0.2),
          highlightColor: theme.colorScheme.primaryContainer.withOpacity(0.1),
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? _slate800 : _white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isDark ? _slate700 : _slate200,
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [_primary, const Color(0xFF1E40AF)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.search_rounded,
                    color: _white,
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
                          color: isDark ? _slate400 : _slate500,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Search 151 documents',
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: isDark ? _slate500 : _slate400,
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
                        : _primary50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isDark
                          ? theme.colorScheme.primaryContainer
                          : _primary.withOpacity(0.2),
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
                            : _primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'K',
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: isDark
                              ? theme.colorScheme.primary
                              : _primary,
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
