# وصلة — ملفات ومحادثات بين الأجهزة

موقع ستاتيك عربي RTL بـ HTML/CSS/JavaScript، ينقل الملفات والمحادثات عبر WebRTC. الربط الحالي **QR أو رابط جلسة واحد** بتنسيق عبر خدمة PeerJS العامة؛ لا يحتاج المستخدم تبادل offer/answer يدويًا.

## الملفات والمسارات
- `/` أو `index.html`: التطبيق.
- `index.html#connect`: نافذة الربط.
- `index.html#j=0123456789abcdef`: شكل رابط الدعوة (مثال فقط، ليس جلسة حقيقية).
- `index.html#help`: التعليمات.
- **`js/app.js` واحد** لجميع منطق التطبيق والربط والنقل والمحادثة والاختبارات.
- `js/vendor/peerjs.min.js`: مكتبة PeerJS 1.5.5 المحلية، من jsDelivr.
- `js/vendor/qrcode.min.js`: مكتبة qrcode-generator 1.4.4 المحلية، من jsDelivr.
- ملفات vendor مكتبات مستقلة غير معدلة؛ ليست نسخ app.js ولا تحتاج تخصيصها. يجب إبقاؤها لأنها مستخدمة من HTML.
- `css/style.css`: التصميم المتجاوب.
- `tests/webrtc.html`: اختبار البروتوكول داخل التطبيق (`?selftest=1`).
- `tests/pairing.html`: نافذة الربط الفعلية.
- `tests/qr.html`: عرض QR اختباري واضح التسمية، ليس جلسة نشطة (`?selftest=qr`).
- `tests/broker.html`: اختبار تسجيل حقيقي لدى خدمة التنسيق (`?selftest=broker`).

## التشغيل والربط
قدّم الملفات من استضافة ستاتيك عبر HTTPS. لا توجد عملية build أو npm أو backend خاص أو قاعدة بيانات أو مفاتيح API. لم يُنفذ نشر Hosted Deploy في هذه المهمة، ولا يوجد رابط إنتاج موثق بعد.

1. افتح الموقع على الكمبيوتر، ثم «ربط جهاز جديد» > «إنشاء QR ورابط جلسة».
2. بعد نجاح التسجيل لدى PeerJS يظهر QR ومعرّف عشوائي من 16 محرفًا ورابط بالشكل `https://your-domain/#j=…`.
3. امسح QR بكاميرا الهاتف العادية، أو افتح الرابط على الجهاز الآخر. لا يطلب التطبيق إذن الكاميرا ولا يتضمن ماسح كاميرا مدمجًا.
4. على الجهاز الثاني اضغط «الاتصال بالجهاز الآخر». لا يبدأ طلب شبكة لمجرد فتح رابط خارجي دون هذا الإجراء.
5. وافق على الجهاز في الصفحة الأولى. لا يوجد رمز رد مطلوب. الموافقة إجراء قبول دعوة وليست نظام حسابات أو تحقق هوية موثوق.
6. انتظر حالة الاتصال ثم اختر الملفات أو اكتب رسالة. المستلم يقبل كل ملف، ثم يضغط «حفظ الملف» بعد الاستلام.

يمكن أيضًا لصق الرابط أو معرّف الجلسة في تبويب «لديّ رابط أو معرّف». الروابط الخارجية أو غير المطابقة لمسار الصفحة تُرفض؛ لذلك استخدم رابط الجلسة نفسه دون تغيير مساره. الرابط أقصر من رموز SDP، لكنه **ليس مختصر URL بخدمة مستقلة**؛ طوله يعتمد على الدومين والمسار. روابط معاينة المحرر طويلة وقد لا تعمل على جهاز آخر؛ استخدم HTTPS مباشرًا بعد النشر.

## الجلسة والخصوصية
- خدمة التنسيق: `0.peerjs.com:443` عبر WSS/HTTPS، خدمة عامة دون مصادقة API، تعتمد عليها خطوة الربط ولا يوجد ضمان توافر لها.
- معرف Peer بالصيغة `wasla-` ثم 16 محرف hex عشوائيًا عبر `crypto.getRandomValues` (64 بت).
- رابط الدعوة يتضمن المعرّف في fragment؛ يقرأه التطبيق ويستخدم المعرف لدى PeerJS. لا تنشر الرابط أو ترسله لطرف غير موثوق.
- PeerJS تتبادل معرفات وSDP ومعلومات ICE بين الجهازين؛ ترى خدمة التنسيق بيانات الربط الشبكية. ليست مخزن ملفات/محادثات في هذا التطبيق.
- الاتصال يقبل جهازًا واحدًا بعد موافقة المستخدم. بيانات التطبيق الواردة في جهة الانضمام تُتجاهل إلى وصول إشارة الموافقة. بعد الربط تُخفى الدعوة وتُرفض اتصالات إضافية.
- الجلسة في الذاكرة فقط؛ إغلاق الصفحة أو إعادة التحميل ينهيها. لا يوجد استئناف تلقائي.
- ليست هذه آلية تسجيل دخول أو ACL لموقع الويب؛ لا توجد حسابات أو صفحات إدارية محمية.
- الأيقونات محلية والخط IBM Plex Sans Arabic من Google Fonts مع بديل محلي sans-serif.

## الشبكات والسرعة
خوادم STUN المضبوطة صراحة:
- `stun:stun.l.google.com:19302`
- `stun:global.stun.twilio.com:3478`

لا يشترط اتصال الجهازين بنفس Wi-Fi، لكن **لا يوجد TURN**. NAT المتماثل وشبكات الشركات وبعض شبكات الهاتف قد تمنع الربط المباشر حتى إذا نجح إنشاء QR والتسجيل في PeerJS. لا توجد سرعة مضمونة. يحتاج تحسين الاعتمادية إلى TURN مُدار مع بيانات اعتماد مؤقتة من خدمة موثوقة، لا أسرار مضمّنة في JavaScript. أبقِ الجهازين والصفحتين مفتوحين؛ قفل الشاشة قد يعلق النقل.

## نقل الملفات والتخزين
- لا Table API ولا Hosted runtime files ولا IndexedDB لبيانات المستخدم. يُستخدم localStorage فقط لتفضيل لغة الواجهة تحت المفتاح `wasla.ui.language`؛ لا تُحفظ به ملفات أو رسائل. لا تُرفع الملفات لخادم ولا تُخزن Base64 في أي قاعدة بيانات.
- الملفات ArrayBuffer ثم Blob في ذاكرة المتصفح؛ التنزيل يدوي. المحادثات لا تُحفظ بعد التحميل.
- حد الملف 200 MiB (تعرض الواجهة MB للتبسيط)، وحد الذاكرة المحجوزة للاستقبال 300 MiB؛ الاستهلاك الفعلي قد يكون أعلى. يفضل ملفات أصغر على الهاتف.
- أجزاء ثنائية 16 KiB، ضغط عكسي عند امتلاء مخزن الإرسال، نقل متسلسل لكل اتجاه، وموافقة لكل ملف.
- تقدم وسرعة محسوبان من البيانات الفعلية، تأكيد استلام، تحقق عدد البايتات، وإلغاء من أي طرف.
- حتى 20 طلب نقل نشطًا، و4000 محرف لكل رسالة، وآخر 300 رسالة بالواجهة.
- «مسح المكتمل» يحرر روابط Blob بعد التأكيد. احفظ الملفات أولًا؛ إعادة التحميل تمحو الروابط والذاكرة.
- لا تفتح ملفات غير موثوقة. الرسائل نصوص آمنة عبر textContent، وليست HTML منفذًا.

## الاختبارات
- نجح **تسجيل حقيقي** لدى خدمة PeerJS العامة، وظهر رابط وQR بعد حدث التسجيل الفعلي؛ هذا ليس إثبات نقل ملف بين جهازين.
- فحص بصري لنافذة الربط على الكمبيوتر وQR مع رابط النسخ على الهاتف، دون قص/تداخل. QR الاختباري معلّم بأنه غير نشط.
- نجح إنشاء SVG بواسطة مكتبة QR القياسية؛ لم يجرِ اختبار مسحه بكاميرا هاتف فعلية، ولا يُستدل على قابلية فك QR من الفحص البصري وحده.
- اختبارات التطبيق تشمل معرفًا عشوائيًا، تحويل الرابط وقراءته، رفض الروابط الخارجية، توليد QR، handshake الموافقة وتجاهل بيانات ما قبلها، محادثة آمنة، موافقة الملف، تقسيم/تجميع ملف 100003 بايت ومطابقة كل البايتات وإقرار الاستلام.
- بيئة Chromium الآلية لا توفر مرشحي ICE؛ لذلك يصرّح الاختبار بتخطي النقل الشبكي الحقيقي ويختبر البروتوكول بقناة داخل الذاكرة. ليس ذلك إثبات اتصال على شبكتين مختلفتين.
- بعض دوال SDP الداخلية القديمة باقية لاختبار loopback، وواجهة الربط اليدوي القديمة مخفية وغير مطلوبة في مسار المستخدم. لا توجد ملفات app.js متعددة.

## Arabic / English interface
- Added a visible **العربية / English** switch in the top bar. Arabic remains the default; English uses a left-to-right layout with the sidebar on the left.
- Language switching updates interface labels, pairing dialogs, help, placeholders, accessibility labels, connection feedback, transfer actions/statuses, notifications and confirmation prompts without reloading or disconnecting.
- Translations and switching logic remain in **`js/app.js`**, alongside existing app logic; no extra application JavaScript file was added.
- User-written messages, drafts, filenames, links and session IDs are not translated. Switching language does not clear transfer history, active sessions or received file links.
- Preference is saved only as `localStorage['wasla.ui.language'] = 'ar' | 'en'`. Blocked localStorage is handled gracefully. `?lang=en` or `?lang=ar` selects the initial language without overriding the stored preference until a switch is clicked.
- `tests/language.html` runs the actual app's switch-button tests (`?selftest=language`): English/Arabic direction, repeated toggles, connected status, new pairing errors, transfer labels/actions, and preservation of the session, draft, filename and user message. Passed.
- `tests/english.html` opens the English dashboard; `tests/english-pairing.html` opens the English QR preview (clearly labelled as a test, not an active session).
- Visually checked English desktop/mobile, English mobile QR pairing, and Arabic mobile layout. No clipping, overlap or horizontal overflow was reported. Existing protocol self-tests still pass; the documented lack of real ICE transport in the test environment is unchanged.
- These edits are saved project changes, not a newly approved public deployment.

## المتبقي
1. نشر بإذن المالك ثم تجربة مسح QR فعليًا، وقبول الجهاز ونقل ملف بين هاتف وكمبيوتر عبر رابط HTTPS مباشر.
2. اختبار على شبكتين مختلفتين وأجهزة هاتف وذاكرة محدودة، بما يشمل الانقطاع وقفل الشاشة.
3. TURN اختياري وsignaling مُدار عند الحاجة لاعتمادية أعلى من الخدمة العامة.
