import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/document.dart';

class DocumentationService extends ChangeNotifier {
  List<Map<String, dynamic>> _folders = [];
  List<Document> _documents = [];
  bool _isLoading = false;
  String? _error;

  // Bookmarks
  Set<String> _bookmarkedDocIds = {};

  List<Map<String, dynamic>> get folders => _folders;
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
      debugPrint('Loading documentation from assets...');
      final jsonString = await rootBundle.loadString('assets/docs/documentation.min.json');
      final data = json.decode(jsonString) as Map<String, dynamic>;

      debugPrint('JSON loaded. Folders count: ${data['folders']?.length}');
      
      _folders = (data['folders'] as List)
          .map((f) => Map<String, dynamic>.from(f))
          .toList();

      debugPrint('Folders parsed: ${_folders.length}');

      _documents = (data['documents'] as List)
          .map((d) => Document.fromJson(d))
          .toList();

      debugPrint('Documents parsed: ${_documents.length}');

      // Load bookmarks from storage
      await _loadBookmarks();

      _isLoading = false;
      debugPrint('Documentation service initialized successfully');
      notifyListeners();
    } catch (e, stackTrace) {
      _error = e.toString();
      _isLoading = false;
      debugPrint('Error loading documentation: $e');
      debugPrint('Stack trace: $stackTrace');
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

  Map<String, dynamic>? getFolderById(String id) {
    try {
      return _folders.firstWhere((f) => f['id'] == id);
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
