# Ujamaa DeFi Documentation App - Setup Guide

## ✅ What's Been Created

### 1. **Flutter Project Structure**
- ✅ Complete Flutter project in `mobile-docs-app/`
- ✅ All necessary screens (Home, Folder, Document, Search, Bookmarks)
- ✅ Services and models
- ✅ Reusable widgets
- ✅ Theme configuration

### 2. **Documentation JSON**
- ✅ Generated from `docs/` folder
- ✅ 12 folders, 78 documents
- ✅ Located at `mobile-docs-app/assets/docs/documentation.json`

### 3. **App Features**
- ✅ Offline reading (all docs bundled)
- ✅ Full-text search
- ✅ Bookmarks with persistence
- ✅ Markdown rendering
- ✅ Share functionality
- ✅ Reading time estimates
- ✅ Dark mode support

---

## 🚀 Next Steps

### Step 1: Install Flutter (if not already installed)

**Windows:**
```powershell
# Download from: https://docs.flutter.dev/get-started/install/windows
# Extract to C:\src\flutter
# Add to PATH
setx PATH "%PATH%;C:\src\flutter\bin"

# Verify
flutter doctor
```

**macOS:**
```bash
brew install --cask flutter
flutter doctor
```

### Step 2: Create App Icons

You'll need to create these icon files in `mobile-docs-app/assets/images/`:

1. **logo-1024.png** - 1024x1024px main logo
2. **logo-android-512.png** - 512x512px Android logo
3. **logo-ios-1024.png** - 1024x1024px iOS logo
4. **logo-foreground-432.png** - 432x432px foreground (for adaptive icons)
5. **logo-splash.png** - Splash screen logo

**Recommended:** Use your existing Ujamaa logo from `documentation/assets/` or `docs/10_DESIGN/`

### Step 3: Add Font Files

Download Inter font from Google Fonts and place in `mobile-docs-app/assets/fonts/`:
- Inter-Regular.ttf
- Inter-Medium.ttf
- Inter-SemiBold.ttf
- Inter-Bold.ttf

Download: https://fonts.google.com/specimen/Inter

### Step 4: Install Dependencies

```bash
cd mobile-docs-app
flutter pub get
```

### Step 5: Generate App Icons (after adding logo images)

```bash
flutter pub run flutter_launcher_icons
flutter pub run flutter_native_splash:create
```

### Step 6: Run the App

```bash
# List available devices
flutter devices

# Run on connected device or emulator
flutter run

# Run in release mode
flutter run --release
```

### Step 7: Build for Production

**Android APK:**
```bash
flutter build apk --release
```

**Android App Bundle (Play Store):**
```bash
flutter build appbundle --release
```

**iOS (Mac only):**
```bash
flutter build ios --release
```

---

## 📱 Testing the App

### On Android Emulator
1. Open Android Studio
2. Create a virtual device (Pixel 6 or similar)
3. Start emulator
4. Run `flutter run`

### On iOS Simulator (Mac only)
1. Open Xcode
2. Select a simulator (iPhone 15 or similar)
3. Run `flutter run`

### On Physical Device
1. Enable Developer Mode on your device
2. Connect via USB
3. Run `flutter devices` to verify
4. Run `flutter run`

---

## 🎨 Customization

### Change App Name
Edit `mobile-docs-app/android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Ujamaa Docs</string>
```

### Change Package Name
```bash
# In mobile-docs-app/
find . -type f -name "*.kt" -o -name "*.java" -o -name "AndroidManifest.xml" | xargs sed -i 's/com.ujamaa.ujamaa_docs/com.ujamaa.docs/g'
```

### Change Colors
Edit `mobile-docs-app/lib/utils/app_theme.dart`:
```dart
static const Color primary = Color(0xFF1E40AF);  // Change this
```

---

## 📊 App Statistics

After building, you can check app size:
```bash
flutter build apk --analyze-size
```

Expected size: **~15-20 MB** (includes all documentation)

---

## 🐛 Troubleshooting

### "No devices found"
- For Android: Start an emulator or connect a physical device
- For iOS: Open a simulator in Xcode

### "Pub get failed"
```bash
flutter clean
flutter pub get
```

### "Build failed"
```bash
flutter clean
flutter pub get
flutter run
```

---

## 📞 Support

If you encounter issues:
1. Check Flutter docs: https://docs.flutter.dev
2. Check error messages carefully
3. Run `flutter doctor -v` for detailed diagnostics

---

**Ready to build! 🚀**
