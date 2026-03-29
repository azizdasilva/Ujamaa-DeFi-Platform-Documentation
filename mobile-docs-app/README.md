# Ujamaa DeFi Documentation Mobile App

**Official mobile documentation app for Ujamaa DeFi Platform**

Built with Flutter for iOS, Android, and Web.

---

## 📱 Features

- ✅ **Offline Reading** - All 151 HTML documents available offline
- ✅ **Full-Text Search** - Find any topic instantly
- ✅ **Bookmarks** - Save documents for later
- ✅ **Dark Mode** - Easy on the eyes
- ✅ **Reading Time** - Know how long each doc takes
- ✅ **Share** - Share documents with team
- ✅ **Fast & Lightweight** - Optimized for mobile
- ✅ **HTML Rendering** - Exact same styling as web documentation

---

## 📊 Documentation Stats

| Metric | Value |
|--------|-------|
| **Folders** | 12 |
| **Documents** | 151 |
| **Total Words** | ~300,000 |
| **Offline Size** | ~8 MB |
| **Source** | HTML Documentation |

---

## 🚀 Quick Start

### Prerequisites

```bash
# Install Flutter SDK
# https://docs.flutter.dev/get-started/install

# Verify installation
flutter doctor
```

### Install Dependencies

```bash
cd mobile-docs-app
flutter pub get
```

### Run on Device/Emulator

```bash
# List available devices
flutter devices

# Run on connected device
flutter run

# Run in release mode
flutter run --release
```

---

## 📁 Project Structure

```
mobile-docs-app/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── models/                      # Data models
│   │   └── document.dart
│   ├── screens/                     # App screens
│   │   ├── home_screen.dart
│   │   ├── folder_screen.dart
│   │   ├── document_screen.dart
│   │   ├── search_screen.dart
│   │   └── bookmarks_screen.dart
│   ├── services/                    # Business logic
│   │   └── documentation_service.dart
│   ├── utils/                       # Utilities
│   │   └── app_theme.dart
│   └── widgets/                     # Reusable components
│       ├── folder_card.dart
│       ├── document_card.dart
│       └── custom_search_bar.dart
├── assets/
│   ├── docs/                        # Documentation JSON
│   │   ├── documentation.json
│   │   └── documentation.min.json
│   ├── images/                      # App images
│   └── fonts/                       # Inter font family
└── pubspec.yaml                     # Dependencies
```

---

## 🎨 App Screenshots

### Home Screen
- Grid of 12 documentation folders
- Search bar with keyboard shortcut hint
- Pull-to-refresh

### Folder Screen
- Folder header with icon and count
- List of documents in folder
- Search in folder

### Document Viewer
- Markdown rendering
- Reading time and word count
- Bookmark and share buttons
- Scrollable content

### Search
- Real-time search results
- Result count
- Empty state with suggestions

### Bookmarks
- Saved documents list
- Clear all option
- Empty state

---

## 🔧 Configuration

### App Icons

```bash
# Generate app icons
flutter pub run flutter_launcher_icons
```

### Splash Screen

```bash
# Generate splash screen
flutter pub run flutter_native_splash:create
```

---

## 📦 Build for Production

### Android APK

```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle (Play Store)

```bash
flutter build appbundle --release
# Output: build/app/outputs/bundle/release/app-release.aab
```

### iOS (Mac only)

```bash
flutter build ios --release
# Open in Xcode for distribution
```

### Web

```bash
flutter build web --release
# Output: build/web/
```

---

## 📱 App Store Requirements

### Google Play Store
- Google Play Developer account ($25 one-time)
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (minimum 2)
- Privacy policy URL

### Apple App Store
- Apple Developer account ($99/year)
- App icon (1024x1024 PNG)
- Screenshots for 6.5" and 5.5" displays
- Privacy policy URL

---

## 🧪 Testing

### Run Tests

```bash
flutter test
```

### Generate Coverage

```bash
flutter test --coverage
```

---

## 📊 Documentation JSON

The app uses a pre-generated JSON file containing all documentation:

```python
# Regenerate documentation.json
python ../generate_docs_json.py
```

This script:
1. Reads all MD files from `docs/` folder
2. Extracts titles, content, and metadata
3. Generates `documentation.json` and `documentation.min.json`
4. Saves to `assets/docs/`

---

## 🎯 Roadmap

### Phase 1 (MVP) - ✅ Complete
- [x] Folder navigation
- [x] Document viewer
- [x] Search functionality
- [x] Bookmarks
- [x] Offline support

### Phase 2 (Enhanced)
- [ ] Annotations/highlights
- [ ] Reading progress tracking
- [ ] Download for offline (selective)
- [ ] Push notifications (updates)
- [ ] Multi-language support

### Phase 3 (Advanced)
- [ ] Table of contents per document
- [ ] Related documents
- [ ] Analytics (most read, search queries)
- [ ] Dark mode scheduling
- [ ] Font size adjustment

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

---

## 📄 License

Copyright © 2026 Ujamaa DeFi Platform. All Rights Reserved.

This mobile app and its source code are proprietary and confidential.

---

## 📞 Support

- **Email:** tech@ujamaa.io
- **Documentation:** https://defi-platform-documentation.ujamaa.io
- **Website:** https://ujamaa.io

---

**Built with ❤️ using Flutter**
