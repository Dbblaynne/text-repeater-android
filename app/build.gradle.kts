plugins { id("com.android.application") }
android {
  namespace = "com.textrepeater"
  compileSdk = 34
  defaultConfig {
    applicationId = "com.textrepeater"
    minSdk = 24
    targetSdk = 34
    versionCode = 1
    versionName = "1.0"
  }
}
dependencies {
  implementation("androidx.core:core-ktx:1.12.0")
}
