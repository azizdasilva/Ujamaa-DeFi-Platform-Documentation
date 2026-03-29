class Document {
  final String id;
  final String folderId;
  final String title;
  final String subtitle;
  final String content;
  final String path;
  final Map<String, dynamic> metadata;
  final int wordCount;
  final int readingTimeMinutes;
  final String lastUpdated;

  Document({
    required this.id,
    required this.folderId,
    required this.title,
    required this.subtitle,
    required this.content,
    required this.path,
    required this.metadata,
    required this.wordCount,
    required this.readingTimeMinutes,
    required this.lastUpdated,
  });

  factory Document.fromJson(Map<String, dynamic> json) {
    return Document(
      id: json['id'] as String,
      folderId: json['folder_id'] as String,
      title: json['title'] as String,
      subtitle: json['subtitle'] as String,
      content: json['content'] as String,
      path: json['path'] as String,
      metadata: json['metadata'] != null 
          ? Map<String, dynamic>.from(json['metadata'])
          : {},
      wordCount: json['word_count'] as int,
      readingTimeMinutes: json['reading_time_minutes'] as int,
      lastUpdated: json['last_updated'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'folder_id': folderId,
      'title': title,
      'subtitle': subtitle,
      'content': content,
      'path': path,
      'metadata': metadata,
      'word_count': wordCount,
      'reading_time_minutes': readingTimeMinutes,
      'last_updated': lastUpdated,
    };
  }
}
