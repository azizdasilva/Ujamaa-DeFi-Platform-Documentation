import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import '../services/documentation_service.dart';

class DocumentScreen extends StatefulWidget {
  final String docId;

  const DocumentScreen({super.key, required this.docId});

  @override
  State<DocumentScreen> createState() => _DocumentScreenState();
}

class _DocumentScreenState extends State<DocumentScreen> {
  InAppWebViewController? webViewController;
  double progress = 0;
  bool isLoading = true;

  @override
  Widget build(BuildContext context) {
    final docService = Provider.of<DocumentationService>(context);
    final document = docService.getDocumentById(widget.docId);

    if (document == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Document Not Found')),
        body: const Center(child: Text('Document not found')),
      );
    }

    final isBookmarked = docService.isBookmarked(widget.docId);

    // Generate HTML content with Ujamaa styling
    final htmlContent = _generateHtmlContent(document);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          document.title.length > 50 
            ? '${document.title.substring(0, 50)}...' 
            : document.title,
        ),
        actions: [
          IconButton(
            icon: Icon(isBookmarked ? Icons.bookmark : Icons.bookmark_border),
            onPressed: () => docService.toggleBookmark(widget.docId),
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
          // Progress Bar
          if (isLoading)
            LinearProgressIndicator(value: progress),
          
          // WebView for HTML content
          Expanded(
            child: InAppWebView(
              initialData: InAppWebViewInitialData(
                data: htmlContent,
                baseUrl: WebUri.uri(Uri.parse('file:///')),
                encoding: 'utf-8',
                mimeType: 'text/html',
              ),
              initialSettings: InAppWebViewSettings(
                javaScriptEnabled: true,
                domStorageEnabled: true,
                useShouldOverrideUrlLoading: true,
                mediaPlaybackRequiresUserGesture: false,
                allowsInlineMediaPlayback: true,
                iframeAllow: "camera; microphone",
                iframeAllowFullscreen: true,
                transparentBackground: false,
                disableContextMenu: true,
                supportZoom: true,
                displayZoomControls: false,
                builtInZoomControls: true,
                scrollbarFadingEnabled: true,
              ),
              onWebViewCreated: (controller) {
                webViewController = controller;
              },
              onLoadStart: (controller, url) {
                setState(() {
                  isLoading = true;
                });
              },
              onLoadStop: (controller, url) async {
                setState(() {
                  isLoading = false;
                });
              },
              onProgressChanged: (controller, progress) {
                setState(() {
                  this.progress = progress / 100;
                });
              },
              onReceivedError: (controller, request, error) {
                debugPrint('WebView Error: ${error.description}');
              },
            ),
          ),
        ],
      ),
    );
  }

  String _generateHtmlContent(dynamic document) {
    // Get system theme mode
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // Generate HTML with embedded CSS matching documentation styling
    return '''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --ujamaa-primary: #2563EB;
      --ujamaa-primary-dark: #1E40AF;
      --ujamaa-accent: #F59E0B;
      --slate-900: #0F172A;
      --slate-800: #1E293B;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-500: #64748B;
      --slate-400: #94A3B8;
      --slate-300: #CBD5E1;
      --slate-200: #E2E8F0;
      --slate-100: #F1F5F9;
      --slate-50: #F8FAFC;
      --white: #FFFFFF;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: ${isDark ? '#CBD5E1' : '#334155'};
      background: ${isDark ? '#0F172A' : '#F8FAFC'};
      padding: 16px;
      margin: 0;
    }
    
    h1 {
      font-size: 2.25rem;
      font-weight: 800;
      line-height: 1.2;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, ${isDark ? '#F1F5F9' : '#1E293B'}, var(--ujamaa-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }
    
    h2 {
      font-size: 1.875rem;
      font-weight: 700;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: ${isDark ? '#F1F5F9' : '#1E293B'};
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: ${isDark ? '#F1F5F9' : '#1E293B'};
    }
    
    p {
      margin-bottom: 1.5rem;
      color: ${isDark ? '#CBD5E1' : '#475569'};
    }
    
    ul, ol {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.875em;
      background: ${isDark ? '#1E293B' : '#F1F5F9'};
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      color: var(--ujamaa-primary);
      border: 1px solid ${isDark ? '#334155' : '#E2E8F0'};
    }
    
    pre {
      background: var(--slate-900);
      border-radius: 0.75rem;
      padding: 1.5rem;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    
    pre code {
      background: transparent;
      color: #CBD5E1;
      border: none;
      padding: 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      border-radius: 0.75rem;
      overflow: hidden;
    }
    
    th {
      background: ${isDark ? '#1E293B' : '#E2E8F0'};
      font-weight: 600;
      text-align: left;
      padding: 1rem;
      color: ${isDark ? '#F1F5F9' : '#1E293B'};
    }
    
    td {
      padding: 1rem;
      border-bottom: 1px solid ${isDark ? '#334155' : '#E2E8F0'};
      color: ${isDark ? '#CBD5E1' : '#475569'};
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:hover {
      background: ${isDark ? '#1E293B' : '#F1F5F9'};
    }
    
    .docs-callout {
      padding: 1.5rem;
      border-radius: 0.75rem;
      border-left: 4px solid var(--ujamaa-primary);
      margin: 1.5rem 0;
      background: ${isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)'};
    }
    
    .docs-callout-title {
      font-weight: 700;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: var(--ujamaa-primary);
    }
    
    a {
      color: var(--ujamaa-primary);
      text-decoration: none;
      font-weight: 500;
      border-bottom: 1px solid transparent;
      transition: all 0.2s ease;
    }
    
    a:hover {
      color: var(--ujamaa-primary-dark);
      border-bottom-color: var(--ujamaa-primary);
    }
    
    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      body {
        background: #0F172A;
        color: #CBD5E1;
      }
    }
  </style>
</head>
<body>
  <h1>${document.title}</h1>
  ${document.subtitle.isNotEmpty ? '<p style="font-size: 1.125rem; color: ${isDark ? '#94A3B8' : '#64748B'}; margin-bottom: 2rem;">${document.subtitle}</p>' : ''}
  
  ${document.content}
  
  <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid ${isDark ? '#334155' : '#E2E8F0'}; font-size: 0.875rem; color: ${isDark ? '#64748B' : '#94A3B8'};">
    <p><strong>Last Updated:</strong> ${document.lastUpdated} | <strong>Reading Time:</strong> ${document.readingTimeMinutes} min</p>
  </div>
</body>
</html>
''';
  }

  Future<void> _shareDocument(dynamic document) async {
    await Share.share(
      '${document.title}\n\n${document.subtitle}\n\nRead more on Ujamaa DeFi Documentation',
      subject: document.title,
    );
  }
}
