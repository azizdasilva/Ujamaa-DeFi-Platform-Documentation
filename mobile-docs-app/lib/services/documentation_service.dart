import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fuse_flutter/fuse_flutter.dart';
import '../models/folder.dart';
import '../models/document.dart';

class DocumentationService extends ChangeNotifier {
  List<Folder> _folders = [];
  List<Document> _documents = [];
  bool _isLoading = false;
  String? _error;
  Fuse? _fuse;
  
  // Bookmarks
  Set<String> _bookmarkedDocIds = {};

  List<Folder> get folders => _folders;
  List<Document> get documents => _documents;
  bool get isLoading => _isLoading;
  String? get error => _error;
  Set<String> get bookmarkedDocIds => _bookmarkedDocIds;

  Future<void> initialize() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Load documentation data from assets
      final jsonString = await rootBundle.loadString('assets/docs/documentation.min.json');
      final data = json.decode(jsonString) as Map<String, dynamic>;
      
      _folders = (data['folders'] as List)
          .map((f) => Folder.fromJson(f))
          .toList();
      
      _documents = (data['documents'] as List)
          .map((d) => Document.fromJson(d))
          .toList();
      
      // Initialize Fuse for search
      _fuse = Fuse(
        _documents,
        keys: ['title', 'subtitle', 'content'],
        options: const FuseOptions(
          threshold: 0.4,
          minMatchCharLength: 2,
        ),
      );
      
      // Load bookmarks from storage
      await _loadBookmarks();
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _loadBookmarks() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final bookmarks = prefs.getStringList('bookmarks') ?? [];
      _bookmarkedDocIds = bookmarks.toSet();
    } catch (e) {
      debugPrint('Error loading bookmarks: $e');
    }
  }

  Future<void> toggleBookmark(String docId) async {
    if (_bookmarkedDocIds.contains(docId)) {
      _bookmarkedDocIds.remove(docId);
    } else {
      _bookmarkedDocIds.add(docId);
    }
    
    // Save to storage
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('bookmarks', _bookmarkedDocIds.toList());
    } catch (e) {
      debugPrint('Error saving bookmarks: $e');
    }
    
    notifyListeners();
  }

  bool isBookmarked(String docId) {
    return _bookmarkedDocIds.contains(docId);
  }

  List<Document> get bookmarkedDocuments {
    return _documents.where((d) => _bookmarkedDocIds.contains(d.id)).toList();
  }

  Folder? getFolderById(String id) {
    try {
      return _folders.firstWhere((f) => f.id == id);
    } catch (e) {
      return null;
    }
  }

  Document? getDocumentById(String id) {
    try {
      return _documents.firstWhere((d) => d.id == id);
    } catch (e) {
      return null;
    }
  }

  List<Document> getDocumentsByFolder(String folderId) {
    return _documents.where((d) => d.folderId == folderId).toList();
  }

  Future<List<Document>> search(String query) async {
    if (_fuse == null || query.isEmpty) {
      return [];
    }
    
    final results = _fuse!.search(query);
    return results.map((r) => r.item).toList();
  }

  List<Document> searchLocally(String query) {
    if (query.isEmpty) {
      return [];
    }
    
    final lowerQuery = query.toLowerCase();
    return _documents.where((d) => 
      d.title.toLowerCase().contains(lowerQuery) ||
      d.subtitle.toLowerCase().contains(lowerQuery) ||
      d.content.toLowerCase().contains(lowerQuery)
    ).toList();
  }
}
