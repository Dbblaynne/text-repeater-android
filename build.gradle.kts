plugins {
    id("com.android.application")
    kotlin("android")
}

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

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.activity:activity-compose:1.8.0")
    implementation("androidx.compose.ui:ui:1.6.0")
    implementation("androidx.compose.material:material:1.6.0")
}
