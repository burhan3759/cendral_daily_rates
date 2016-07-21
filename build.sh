cd platforms/android/build/outputs/apk/;
cordova build --release android;
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name
rm CDR.apk
./zipalign -v 4  android-release-unsigned.apk CDR.apk;
cp CDR.apk ~/Desktop/CDR.apk;

