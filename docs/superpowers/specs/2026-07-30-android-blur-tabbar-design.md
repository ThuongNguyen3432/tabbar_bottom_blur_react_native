# Spike: Bottom tab bar có blur trên Android

**Ngày:** 2026-07-30
**Trạng thái:** Design đã duyệt, chưa triển khai

## Câu hỏi spike phải trả lời

**Từ Android API nào thì một bottom tab bar có hiệu ứng blur là dùng được trong sản phẩm thật?**

Câu trả lời phải kèm số liệu frame time, không phải cảm nhận bằng mắt.

Bối cảnh: `wms-app` đặt `minSdkVersion = 24`, nghĩa là phần lớn máy quét kho nằm dưới Android 12 — nơi Android **không có** API blur hệ thống. Nếu blur chỉ khả thi từ API 31 thì đó là một quyết định sản phẩm, không phải chi tiết kỹ thuật.

## Phi mục tiêu

- Không làm iOS. Thư mục `ios/` giữ nguyên nhưng không chạy `pod install`.
- Không thiết kế giao diện đẹp. Tab bar chỉ cần đủ để có thứ mà blur.
- Không port về `wms-app` trong phạm vi spike này.

## Quyết định môi trường

| Hạng mục | Giá trị | Ghi chú |
|---|---|---|
| Vị trí | `/Volumes/DEV/test_tabbar_bottom_blur` | |
| Tên app | `TabbarBlurLab` | tách khỏi tên thư mục vì RN CLI sinh package name từ tên project |
| React Native | 0.86.2 | New Architecture bật mặc định |
| `minSdkVersion` | 24 | đã là mặc định của RN 0.86, không cần sửa |
| `ndkVersion` | 27.1.12297006 | trùng `dh-wms`, dùng lại NDK sẵn có |
| Node | v25.2.1 | nằm trong `engines` của RN 0.86.2 (`>= 25.0.0`) |
| Git | repo riêng | |

## Kiến trúc

```
src/
  blur/
    types.ts                  BlurBackend interface
    registry.ts               danh sách backend, đổi được lúc chạy
    backends/
      NoBlur.tsx              baseline: chỉ scrim mờ, không blur
      RenderEffectBlur.tsx    native Kotlin, API 31+
      ExpoBlur.tsx            expo-blur + experimentalBlurMethod
  tabbar/BlurTabBar.tsx       custom tabBar cho React Navigation 7
  screens/FeedScreen.tsx      list nhiều màu, cuộn nặng
  screens/LabScreen.tsx       đổi backend, chỉnh blur radius
android/app/src/main/java/com/tabbarblurlab/blur/
  RenderEffectBlurView.kt
  RenderEffectBlurViewManager.kt
  BlurPackage.kt
scripts/measure.sh            đo tự động, một backend mỗi lần chạy
```

### Hai ràng buộc không được vi phạm

**1. Backend `NoBlur` là bắt buộc.** Không có mốc nền thì mọi con số FPS đều vô nghĩa — không phân biệt được chi phí của blur với chi phí của list. Mọi kết quả đọc theo **hiệu số** với `NoBlur` trên cùng thiết bị, cùng kịch bản.

**2. Nội dung phải cuộn xuyên dưới tab bar.** Tab bar `position: 'absolute'`, list có padding đáy tương ứng. Nếu phía sau tab bar không có gì chuyển động thì blur không phải tính lại mỗi frame và phép đo cho ra số đẹp giả tạo.

### BlurBackend interface

Mỗi backend là một React component nhận cùng một bộ prop (`blurRadius`, `tint`, `style`, `children`) và tự lo phần còn lại. Nhờ vậy đổi backend không đụng tới `BlurTabBar` hay màn hình. Thêm backend thứ tư sau này chỉ là thêm một file và một dòng trong `registry.ts`.

## Cách đo

**Không dùng `requestAnimationFrame`.** rAF chạy trên JS thread, còn chi phí blur nằm trên render thread của Android. JS có thể đều 60fps trong khi màn hình giật thấy rõ. Đây là cái bẫy phổ biến nhất của loại spike này và đo sai sẽ dẫn tới kết luận sai.

Dùng `dumpsys gfxinfo`:

```bash
adb shell dumpsys gfxinfo com.tabbarblurlab reset
# lặp N lần, cùng toạ độ, cùng thời lượng
adb shell input swipe 540 1600 540 400 300
adb shell dumpsys gfxinfo com.tabbarblurlab
```

Chỉ số ghi nhận: tổng số frame, số và % janky frame, p50/p90/p95/p99 frame time.

Kịch bản cuộn được script hoá để mọi lần chạy giống hệt nhau; biến duy nhất thay đổi giữa các lần là backend.

## Ma trận thử nghiệm

| Thiết bị | API | Backend | Trạng thái |
|---|---|---|---|
| AVD `Pixel_6a_64G` | 34 | NoBlur, RenderEffect, ExpoBlur | sẵn sàng |
| AVD mới | 30 | NoBlur, ExpoBlur | **phải tải system image ~1–2 GB** |
| Máy Android thật đời thấp | chưa rõ | tất cả | **chưa có — xem Câu hỏi mở** |

## Tiêu chí thành công

Spike xong khi có một bảng số liệu cho phép trả lời dứt khoát một trong hai:

- "Blur dùng được từ API `<X>` trở lên, dưới mức đó dùng scrim mờ thay thế", hoặc
- "Blur không dùng được trên tập thiết bị mục tiêu"

Kèm theo: kết luận về việc `expo-blur` trên API 31+ có thực sự đi qua `RenderEffect` hay không — điều này **chưa được xác minh**, sẽ đọc code native của thư viện chứ không suy đoán.

## Rủi ro

1. **Emulator không đại diện hiệu năng.** GPU của máy Mac mạnh hơn nhiều lần chip máy quét kho. Cách blur giả lập sẽ trông mượt trên emulator và có thể giật thảm hại trên thiết bị thật. Emulator chỉ dùng để dựng và kiểm tra tính đúng đắn hình ảnh; số liệu kết luận phải lấy từ máy thật.
2. **`expo-modules-core` có thể chưa tương thích RN 0.86.** Expo thường trễ hơn RN vài tuần. Nếu vỡ, đổi sang thư viện blur khác hoặc tự viết fallback giả lập.
3. **Fabric component cần codegen spec**, nhiều việc hơn ViewManager kiểu cũ của old architecture.

## Câu hỏi mở

**Có máy Android thật đời thấp để cắm đo không, và nó chạy Android mấy?**

Chưa có câu trả lời. Không có máy thật thì spike vẫn chạy được nhưng kết luận dừng ở mức "trên emulator thì thế này" và **không chốt được `minSdk`** — tức là không đạt tiêu chí thành công ở trên.
