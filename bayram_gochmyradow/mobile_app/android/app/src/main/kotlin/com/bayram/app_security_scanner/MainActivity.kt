package com.bayram.app_security_scanner

import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Build
import android.provider.Settings
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.ByteArrayOutputStream

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.bayram.app_security_scanner/apps"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "getInstalledApps" -> {
                    try {
                        val apps = getInstalledApps()
                        result.success(apps)
                    } catch (e: Exception) {
                        result.error("ERROR", e.message, null)
                    }
                }
                "uninstallApp" -> {
                    val packageName = call.argument<String>("packageName")
                    if (packageName != null) {
                        uninstallApp(packageName)
                        result.success(true)
                    } else {
                        result.error("ERROR", "Package name is required", null)
                    }
                }
                "openAppSettings" -> {
                    val packageName = call.argument<String>("packageName")
                    if (packageName != null) {
                        openAppSettings(packageName)
                        result.success(true)
                    } else {
                        result.error("ERROR", "Package name is required", null)
                    }
                }
                "forceStopApp" -> {
                    val packageName = call.argument<String>("packageName")
                    if (packageName != null) {
                        forceStopApp(packageName)
                        result.success(true)
                    } else {
                        result.error("ERROR", "Package name is required", null)
                    }
                }
                "openPermissionSettings" -> {
                    val packageName = call.argument<String>("packageName")
                    if (packageName != null) {
                        openPermissionSettings(packageName)
                        result.success(true)
                    } else {
                        result.error("ERROR", "Package name is required", null)
                    }
                }
                else -> result.notImplemented()
            }
        }
    }

    private fun getInstalledApps(): List<Map<String, Any?>> {
        val pm = packageManager
        val packages: List<PackageInfo> = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            pm.getInstalledPackages(PackageManager.PackageInfoFlags.of(PackageManager.GET_PERMISSIONS.toLong()))
        } else {
            @Suppress("DEPRECATION")
            pm.getInstalledPackages(PackageManager.GET_PERMISSIONS)
        }

        return packages.mapNotNull { packageInfo ->
            try {
                val appInfo = packageInfo.applicationInfo ?: return@mapNotNull null
                val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0

                val appName = pm.getApplicationLabel(appInfo).toString()
                val packageName = packageInfo.packageName
                val versionName = packageInfo.versionName ?: "Unknown"
                val permissions = packageInfo.requestedPermissions?.toList() ?: emptyList()

                // Get app icon as bytes
                val iconBytes = try {
                    val drawable = pm.getApplicationIcon(appInfo)
                    drawableToBytes(drawable)
                } catch (e: Exception) {
                    null
                }

                // Calculate app size
                val sourceDir = appInfo.sourceDir
                val appSize = try {
                    java.io.File(sourceDir).length()
                } catch (e: Exception) {
                    0L
                }

                mapOf(
                    "appName" to appName,
                    "packageName" to packageName,
                    "versionName" to versionName,
                    "isSystemApp" to isSystemApp,
                    "permissions" to permissions,
                    "iconBytes" to iconBytes,
                    "appSize" to appSize,
                    "installTime" to packageInfo.firstInstallTime,
                    "updateTime" to packageInfo.lastUpdateTime
                )
            } catch (e: Exception) {
                null
            }
        }
    }

    private fun drawableToBytes(drawable: Drawable): ByteArray? {
        return try {
            val bitmap = if (drawable is BitmapDrawable) {
                drawable.bitmap
            } else {
                val width = drawable.intrinsicWidth.coerceAtLeast(1)
                val height = drawable.intrinsicHeight.coerceAtLeast(1)
                val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bitmap)
                drawable.setBounds(0, 0, canvas.width, canvas.height)
                drawable.draw(canvas)
                bitmap
            }

            val scaledBitmap = Bitmap.createScaledBitmap(bitmap, 72, 72, true)
            val stream = ByteArrayOutputStream()
            scaledBitmap.compress(Bitmap.CompressFormat.PNG, 80, stream)
            stream.toByteArray()
        } catch (e: Exception) {
            null
        }
    }

    private fun uninstallApp(packageName: String) {
        val intent = Intent(Intent.ACTION_DELETE).apply {
            data = Uri.parse("package:$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(intent)
    }

    private fun openAppSettings(packageName: String) {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.parse("package:$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(intent)
    }

    private fun forceStopApp(packageName: String) {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.parse("package:$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(intent)
    }

    private fun openPermissionSettings(packageName: String) {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.parse("package:$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(intent)
    }
}
