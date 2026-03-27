import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../services/documentation_service.dart';
import '../widgets/document_card.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<dynamic> _searchResults = [];
  bool _isSearching = false;
  bool _hasSearched = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _performSearch(String query) {
    if (query.isEmpty) {
      setState(() {
        _searchResults = [];
        _isSearching = false;
        _hasSearched = false;
      });
      return;
    }

    setState(() {
      _isSearching = true;
    });

    final docService = Provider.of<DocumentationService>(context, listen: false);
    
    final results = docService.searchLocally(query);
    
    setState(() {
      _searchResults = results;
      _isSearching = false;
      _hasSearched = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          autofocus: true,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
          ),
          decoration: InputDecoration(
            hintText: 'Search...',
            hintStyle: theme.textTheme.titleMedium?.copyWith(
              color: isDark ? AppTheme.slate500 : AppTheme.slate400,
              fontWeight: FontWeight.w700,
            ),
            border: InputBorder.none,
            suffixIcon: _searchController.text.isNotEmpty
                ? IconButton(
                    icon: Icon(
                      Icons.clear_rounded,
                      color: isDark ? AppTheme.slate400 : AppTheme.slate500,
                    ),
                    onPressed: () {
                      _searchController.clear();
                      _performSearch('');
                    },
                  )
                : null,
          ),
          onChanged: _performSearch,
        ),
      ),
      body: _isSearching
          ? const _SearchLoadingState()
          : !_hasSearched
              ? _SearchPrompt()
              : _searchResults.isEmpty
                  ? _SearchEmptyState(query: _searchController.text)
                  : _SearchResults(results: _searchResults),
    );
  }
}

class _SearchLoadingState extends StatelessWidget {
  const _SearchLoadingState();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 48,
            height: 48,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              valueColor: AlwaysStoppedAnimation<Color>(
                theme.colorScheme.primary,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'Searching...',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _SearchPrompt extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primary.withOpacity(0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: const Icon(
                Icons.search_rounded,
                color: AppTheme.white,
                size: 40,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Search Documentation',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Find articles, guides, and specifications\nacross 151 documents',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: isDark ? AppTheme.slate400 : AppTheme.slate500,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 32),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: [
                _SearchChip(label: 'EUROD', icon: Icons.currency_exchange),
                _SearchChip(label: 'Liquidity Pools', icon: Icons.pool),
                _SearchChip(label: 'Smart Contracts', icon: Icons.code),
                _SearchChip(label: 'Compliance', icon: Icons.verified),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _SearchChip extends StatelessWidget {
  final String label;
  final IconData icon;

  const _SearchChip({
    required this.label,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return ActionChip(
      avatar: Icon(
        icon,
        size: 18,
        color: isDark ? theme.colorScheme.primary : AppTheme.primary,
      ),
      label: Text(
        label,
        style: theme.textTheme.labelLarge?.copyWith(
          color: isDark ? theme.colorScheme.primary : AppTheme.primary,
          fontWeight: FontWeight.w600,
        ),
      ),
      backgroundColor: isDark
          ? theme.colorScheme.primaryContainer.withOpacity(0.15)
          : AppTheme.primary50,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(
          color: isDark
              ? theme.colorScheme.primaryContainer
              : AppTheme.primary.withOpacity(0.2),
        ),
      ),
      onPressed: () {
        final searchController = context.findAncestorStateOfType<_SearchScreenState>();
        searchController?._searchController.text = label;
        searchController?._performSearch(label);
      },
    );
  }
}

class _SearchEmptyState extends StatelessWidget {
  final String query;

  const _SearchEmptyState({required this.query});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: isDark ? AppTheme.slate800 : AppTheme.slate100,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.search_off_rounded,
                size: 40,
                color: isDark ? AppTheme.slate500 : AppTheme.slate400,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'No results found',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'No documents match "$query"\nTry different keywords',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: isDark ? AppTheme.slate400 : AppTheme.slate500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SearchResults extends StatelessWidget {
  final List<dynamic> results;

  const _SearchResults({required this.results});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.colorScheme.primaryContainer.withOpacity(0.1),
            border: Border(
              bottom: BorderSide(
                color: theme.colorScheme.primaryContainer.withOpacity(0.3),
                width: 1,
              ),
            ),
          ),
          child: Row(
            children: [
              Icon(
                Icons.check_circle_rounded,
                color: theme.colorScheme.primary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                '${results.length} result${results.length != 1 ? 's' : ''} found',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: results.length,
            separatorBuilder: (context, index) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final document = results[index];
              return FadeInUp(
                delay: Duration(milliseconds: index * 30),
                child: DocumentCard(document: document),
              );
            },
          ),
        ),
      ],
    );
  }
}

class FadeInUp extends StatefulWidget {
  final Widget child;
  final Duration delay;

  const FadeInUp({
    super.key,
    required this.child,
    this.delay = Duration.zero,
  });

  @override
  State<FadeInUp> createState() => _FadeInUpState();
}

class _FadeInUpState extends State<FadeInUp> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    
    _fadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    );
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.1),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
    
    Future.delayed(widget.delay, () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: widget.child,
      ),
    );
  }
}
