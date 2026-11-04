'use strict';
(() => {
  const $ = id => document.getElementById(id);
  // UI translations live here alongside the rest of the application logic.
  // Translate text nodes only: never replace markup, user messages, filenames or input values.
  const englishUI = {
    'وصلة — المسافة أقصر مما تتخيل': 'Wasla — Bring your devices closer',
    'وصلة الرئيسية': 'Wasla home', 'وصلة': 'Wasla',
    'مساحتك المتصلة': 'YOUR CONNECTED SPACE', 'القائمة الرئيسية': 'Main navigation',
    'نقل الملفات': 'File transfer', 'المحادثة': 'Chat', 'مباشر': 'Live',
    'بينك وبين أجهزتك فقط': 'Just you and your devices',
    'ملفاتك تنتقل مباشرة، دون تخزينها على خوادمنا.': 'Your files travel directly, without being stored on our servers.',
    'كيف تعمل وصلة؟': 'How does Wasla work?', 'صُنع ليقرّب المسافات': 'Made to bring you closer',
    'مساحة العمل': 'Workspace', 'المساعدة': 'Help',
    'لا يوجد اتصال نشط': 'No active connection', 'جهازان متصلان الآن': 'Two devices connected', 'جارٍ الربط…': 'Connecting…',
    'أجهزتك أقرب، أينما كنت': 'Your devices, closer wherever you are',
    'ملفاتك هنا.': 'Your files, here.', 'وهناك، بلحظة.': 'And there, in a moment.',
    'انقل ملفاتك وتحدث بين هاتفك وكمبيوترك. بلا أسلاك، بلا تعقيد.': 'Share files and chat between your phone and computer. No cables. No hassle.',
    'اتصال مشفّر من طرف إلى طرف': 'End-to-end encrypted connection', 'ربط الأجهزة': 'Connect devices',
    'لنبدأ الاتصال': 'LET’S GET CONNECTED', 'أنتما الآن على وصلة واحدة': 'YOU’RE NOW CONNECTED', 'بانتظار جهازك الآخر': 'WAITING FOR YOUR OTHER DEVICE',
    'جهازان. وصلة واحدة.': 'Two devices. One connection.', 'أهلًا بجهازك الآخر.': 'Hello, other device.',
    'اربط جهازك الآخر لتبدأ إرسال الملفات والرسائل بأمان.': 'Connect your other device to share files and messages securely.',
    'أرسل ملفاتك أو ابدأ محادثتك. أبقِ الموقع مفتوحًا على الجهازين.': 'Send a file or start a chat. Keep this page open on both devices.',
    'ربط جهاز جديد': 'Connect a device', 'قطع الاتصال': 'Disconnect',
    'مباشرة بين أجهزتك': 'Directly between your devices', 'اختيار ملفات للإرسال': 'Choose files to send',
    'أفلت ملفاتك هنا، والباقي علينا': 'Drop your files here. We’ll take it from there.',
    'صور، فيديو، مستندات… كل ما تريد مشاركته': 'Photos, videos, documents… anything you want to share',
    'اختر ملفاتك': 'Choose files', 'أو اضغط في أي مكان لاختيار الملفات': 'Or click anywhere here to choose files',
    'لا تُحفظ الملفات على خادم': 'Files are not stored on a server', 'حتى 200 MB للملف': 'Up to 200 MB per file',
    'نشاط النقل': 'Transfer activity', 'مسح المكتمل': 'Clear completed',
    'مساحة لملفاتك القادمة': 'Ready for your next file', 'ستظهر الملفات المرسلة والمستلمة هنا.': 'Sent and received files will appear here.',
    'بانتظار الاتصال': 'Waiting to connect', 'متصل الآن': 'Connected now',
    'حديث صغير. مسافة أقصر.': 'A little chat. A little closer.',
    'أرسل رابطًا، ملاحظة، أو حتى «مرحبًا»': 'Send a link, a note, or just a “hello”', 'إلى جهازك الآخر، في اللحظة نفسها.': 'to your other device, in real time.',
    'لا يتم حفظ محادثاتك': 'Your chats are not saved', 'اكتب رسالتك هنا…': 'Type a message…', 'رسالتك': 'Your message', 'إرسال الرسالة': 'Send message',
    'جهازك الآخر فقط من يمكنه قراءة رسائلك': 'Only your other device can read your messages',
    'مزايا وصلة': 'Wasla features', 'أقل خطوات. أسرع وصول.': 'Fewer steps. Faster sharing.', 'نقل مباشر بسرعة اتصال أجهزتك': 'Direct transfer at your connection’s speed',
    'خصوصيتك، كما يجب أن تكون': 'Privacy, the way it should be', 'تشفير أثناء النقل، دون تخزين سحابي': 'Encrypted in transit. No cloud storage.',
    'شبكتان؟ لا مشكلة.': 'Different networks? No problem.', 'لا يشترط الاتصال بنفس شبكة Wi-Fi*': 'No need to share the same Wi-Fi network*',
    'مساحة أقل بين أجهزتك.': 'Less distance between your devices.', '* يعتمد الاتصال على إعدادات الشبكة.': '* Connection depends on network settings.', 'اعرف المزيد ↗': 'Learn more ↗',
    'اتصال مباشر وآمن': 'DIRECT, SECURE CONNECTION', 'قرّب أجهزتك بوصلة': 'Bring your devices together', 'إغلاق': 'Close',
    'رابط واحد. مسحة واحدة. أنشئ جلسة وامسح QR بكاميرا هاتفك أو افتح رابطها على الجهاز الآخر.': 'One link. One scan. Create a session, then scan the QR code with your phone or open its link on your other device.',
    'عرض QR والرابط': 'Show QR & link', 'لديّ رابط أو معرّف': 'I have a link or ID', 'اضغط لإنشاء جلسة ربط': 'Create a session to get started',
    'امسح بكاميرا الهاتف العادية — لا تحتاج إلى تطبيق': 'Scan with your phone’s camera — no app needed',
    'امسح بكاميرا الهاتف العادية — ثم افتح الرابط': 'Scan with your phone’s camera, then open the link',
    'إنشاء QR ورابط جلسة': 'Create QR & session link', 'رابط الجلسة': 'Session link', 'نسخ': 'Copy', 'معرّف الجلسة': 'Session ID',
    'الرابط صالح ما دامت هذه الصفحة مفتوحة وتنتظر جهازًا. لا تشاركه علنًا.': 'The link works while this page is open and waiting for a device. Do not share it publicly.',
    'افتح الرابط مباشرة، أو الصقه هنا': 'Open the link directly, or paste it here', 'https://…/#j=… أو معرّف الجلسة': 'https://…/#j=… or session ID',
    'الاتصال بالجهاز الآخر': 'Connect to other device', 'استخدم رابطًا من هذا الموقع أو معرّف الجلسة المكوّن من 16 محرفًا.': 'Use a link from this site or a 16-character session ID.',
    'يريد جهاز الانضمام إلى جلستك': 'A device wants to join your session', 'وافق فقط إذا كنت أنت من فتح الرابط على جهازك الآخر.': 'Accept only if you opened the link on your other device.',
    'قبول الجهاز': 'Accept device', 'رفض': 'Decline',
    'تنسيق الربط عبر PeerJS العامة. النقل عبر WebRTC؛ لا يوجد TURN.': 'Pairing uses public PeerJS signaling. Transfers use WebRTC; TURN is not configured.',
    'وصلة صغيرة، إمكانيات كثيرة.': 'One connection. So many possibilities.',
    'افتح وصلة على الجهازين': 'Open Wasla on both devices', 'استخدم متصفحًا حديثًا مثل Chrome أو Safari، ورابط HTTPS نفسه.': 'Use a modern browser such as Chrome or Safari, and the same HTTPS site.',
    'امسح QR أو افتح رابط الجلسة': 'Scan the QR code or open the session link',
    'على الكمبيوتر اضغط «إنشاء QR ورابط جلسة». امسح QR بكاميرا الهاتف العادية، أو أرسل رابط الجلسة إلى الجهاز الآخر وافتحه. ثم وافق على الجهاز في الصفحة الأولى؛ لا يوجد رمز رد.': 'On your computer, select “Create QR & session link”. Scan it with your phone’s camera, or send and open the link on your other device. Accept the device on the first screen. No reply code needed.',
    'أرسل ما تريد': 'Share what you need',
    'اختر ملفاتك أو اسحبها إلى المساحة المخصصة، واستخدم المحادثة لتبادل النصوص والروابط. يجب قبول الملف قبل نقله.': 'Choose or drop your files, and use chat for text and links. Each file must be accepted before transfer.',
    'بشفافية، قبل أن تبدأ': 'A few things to know',
    'لا يشترط وجود الجهازين على الشبكة نفسها. تستخدم وصلة خدمة PeerJS العامة لتنسيق الربط وخوادم STUN لاكتشاف مسار WebRTC، دون خادم ترحيل TURN. تعتمد خطوة الربط على توفر الخدمة العامة، ولا تضمن هذه الخدمة مستوى توافر محددًا. بعض شبكات الهاتف والشركات تمنع الاتصال المباشر. لا توجد سرعة مضمونة؛ تعتمد السرعة على اتصال الجهازين. جرّب شبكة أخرى إذا تعذّر الربط.': 'Your devices do not need to be on the same network. Wasla uses public PeerJS signaling and STUN servers to find a WebRTC route, without a TURN relay. Pairing depends on the public service’s availability, which is not guaranteed. Some mobile and corporate networks block direct connections. Transfer speed depends on both connections and is not guaranteed. Try a different network if pairing fails.',
    'أبقِ الصفحتين ظاهرتين، خصوصًا على الهاتف. الملفات مؤقتة في ذاكرة المتصفح (200 MB كحد أقصى للملف)، والمحادثات لا تُحفظ بعد إعادة التحميل. رابط الجلسة دعوة مؤقتة وليس تسجيل دخول. شاركه فقط مع جهاز تثق به، ولا توافق على جهاز لا تعرفه. خدمة التنسيق ترى معرّفات ومعلومات الاتصال، وليست مخزنًا للملفات. لا تفتح ملفات لا تثق بمصدرها.': 'Keep both pages visible, especially on your phone. Files stay temporarily in browser memory (up to 200 MB each); chats disappear after a reload. The session link is a temporary invitation, not a login. Share it only with a trusted device and reject unfamiliar devices. The signaling service sees connection IDs and network information, not a file store. Never open files from untrusted sources.',
    'الجهاز الآخر غير متصل. اربط الجهازين أولًا.': 'The other device is offline. Connect both devices first.',
    'توقف النقل — انقطع الاتصال': 'Transfer stopped — connection lost',
    'تم الربط بنجاح. يمكنك الآن إرسال الملفات والرسائل.': 'Connected. You can now send files and messages.',
    'تم الاتصال بجهازك الآخر بنجاح': 'Your other device is connected',
    'حدث خطأ في قناة النقل. أعد الربط.': 'The data channel encountered an error. Reconnect to continue.',
    'انتهى الاتصال. أعد الربط للمتابعة.': 'Connection ended. Reconnect to continue.',
    'متصفحك لا يدعم WebRTC. استخدم إصدارًا حديثًا من Chrome أو Safari.': 'Your browser does not support WebRTC. Use a recent Chrome or Safari version.',
    'تعذّر الاتصال المباشر. جرّب شبكة أخرى؛ هذه الشبكة قد تحتاج خادم TURN غير متاح في هذه النسخة.': 'Direct connection failed. Try another network; this one may need a TURN relay, which is not configured.',
    'تعذّر الربط عبر هذه الشبكة. جرّب اتصال إنترنت آخر.': 'Could not connect on this network. Try another internet connection.',
    'الاتصال غير مستقر. أبقِ الجهازين متصلين بالإنترنت.': 'Unstable connection. Keep both devices online.', 'فُقد الاتصال. أعد الربط.': 'Connection lost. Please reconnect.',
    'قطع الاتصال؟ سيتوقف أي نقل جارٍ.': 'Disconnect? Any active transfers will stop.', 'تم قطع الاتصال.': 'Disconnected.',
    'بانتظار الاتصال… إن لم ينجح، جرّب شبكة أخرى.': 'Waiting to connect… Try a different network if it fails.',
    'الصق رابط الجلسة أو معرّفها المكوّن من 16 محرفًا.': 'Paste the session link or its 16-character ID.',
    'استخدم رابط جلسة من الصفحة نفسها، وليس رابطًا خارجيًا.': 'Use a session link from this page, not an external URL.',
    'QR لرابط الجلسة': 'Session link QR code', 'تعذّر إنشاء QR؛ انسخ رابط الجلسة أدناه.': 'Could not generate a QR code. Copy the session link below.',
    'لم تُحمّل مكتبة الاتصال. أعد تحميل الصفحة.': 'The connection library did not load. Reload the page.', 'متصفحك لا يدعم WebRTC.': 'Your browser does not support WebRTC.',
    'جارٍ الاتصال بخدمة تنسيق الربط…': 'Connecting to the signaling service…',
    'تعذّر الوصول لخدمة الربط. تحقق من الإنترنت وأعد المحاولة.': 'Could not reach the pairing service. Check your connection and try again.',
    'الجلسة جاهزة. امسح QR أو افتح رابطها على الجهاز الآخر.': 'Session ready. Scan the QR code or open the link on your other device.',
    'جارٍ الاتصال بالجهاز الآخر… ثم انتظر موافقته.': 'Connecting to the other device… Then wait for its approval.',
    'الجلسة غير متاحة أو تعذّر مسار WebRTC. أبقِ الجهاز الأول مفتوحًا أو جرّب شبكة أخرى؛ قد تحتاج TURN.': 'Session unavailable or WebRTC route failed. Keep the first device open or try another network; TURN may be needed.',
    'وصل طلب من جهاز. تأكد أنه جهازك ثم وافق عليه.': 'A device has requested to join. Make sure it is yours before accepting.',
    'انتهت مهلة طلب الانضمام. يمكن للجهاز إعادة فتح الرابط.': 'The join request expired. The device can reopen the link.',
    'تعذّر الاتصال بالجهاز الطالب.': 'Could not connect to the requesting device.', 'انقطع الاتصال بخدمة التنسيق. أنشئ جلسة جديدة.': 'Disconnected from signaling. Create a new session.',
    'الجلسة غير موجودة. تأكد من الرابط وبقاء الصفحة الأولى مفتوحة.': 'Session not found. Check the link and keep the first page open.',
    'تعذّر حجز معرّف الجلسة. أنشئ جلسة جديدة.': 'Could not reserve this session ID. Create a new session.',
    'تعذّر الوصول لخدمة PeerJS العامة. تحقق من اتصالك أو أعد المحاولة لاحقًا.': 'Could not reach public PeerJS. Check your connection or try again later.',
    'تعذّر اتصال WebRTC. قد تمنع الشبكة الاتصال المباشر دون TURN.': 'WebRTC connection failed. This network may block direct connections without TURN.',
    'تعذّر الربط. تحقق من الإنترنت وجرب جلسة جديدة.': 'Pairing failed. Check your connection and try a new session.',
    'تعذّر فتح قناة البيانات.': 'Could not open the data channel.', 'وصلنا للجهاز الآخر. بانتظار قبوله…': 'Reached the other device. Waiting for approval…',
    'انتهت مهلة انتظار موافقة الجهاز الآخر. افتح الرابط مجددًا.': 'Approval timed out. Open the link again.',
    'تعذّر مسار البيانات. جرّب شبكة أخرى.': 'Data connection failed. Try another network.', 'انتهى الاتصال. أنشئ جلسة جديدة.': 'Connection ended. Create a new session.',
    'جارٍ فتح قناة البيانات…': 'Opening the data channel…', 'تم رفض الجهاز. يمكنك مشاركة الرابط مع جهازك الصحيح.': 'Device declined. You can share the link with your intended device.',
    'تم نسخ رابط الجلسة. افتحه على جهازك الآخر.': 'Session link copied. Open it on your other device.', 'انسخ الرابط المحدد يدويًا.': 'Copy the selected link manually.',
    'اربط جهازك الآخر أولًا لإرسال الرسائل.': 'Connect your other device before sending messages.',
    'اربط الجهازين أولًا، ثم اختر ملفاتك من جديد.': 'Connect both devices first, then choose your files again.',
    'يمكنك طلب نقل 20 ملفًا في الوقت نفسه. انتظر اكتمال بعض الملفات.': 'You can have 20 active file requests. Wait for some transfers to finish.',
    'انتهت مهلة انتظار الموافقة': 'Approval timed out', 'انقطع الاتصال. أعد ربط الجهازين.': 'Connection lost. Reconnect both devices.',
    'الذاكرة المؤقتة ممتلئة. احفظ الملفات المكتملة ثم اضغط «مسح المكتمل».': 'Temporary memory is full. Save completed files, then select “Clear completed”.',
    'توقف النقل: لم تصل بيانات خلال 90 ثانية': 'Transfer stopped: no data received for 90 seconds',
    'انتهت مهلة إرسال البيانات': 'Sending data timed out', 'توقف النقل': 'Transfer stopped',
    'أُرسلت البيانات · بانتظار تأكيد الاستلام': 'Data sent · Waiting for receipt confirmation', 'لم يصل تأكيد الاستلام': 'Receipt confirmation not received',
    'تم رفض بيانات بحجم غير مطابق': 'Rejected data with an unexpected size', 'تم رفض الملف': 'File declined', 'انتهت مهلة طلب النقل': 'Transfer request expired',
    'يريد جهازك الآخر إرسال ملف. اضغط «قبول» لبدء النقل.': 'Your other device wants to send a file. Select “Accept” to start.',
    'يوجد نقل آخر قيد الاستلام': 'Another file is being received', 'الملف غير مكتمل. أعد إرساله.': 'The file is incomplete. Send it again.',
    'حفظ الملف': 'Save file', 'رفض الجهاز الآخر الملف': 'The other device declined the file', 'ألغى الجهاز الآخر النقل': 'The other device canceled the transfer',
    'لا يوجد نشاط مكتمل لمسحه بعد.': 'No completed transfers to clear yet.',
    'هل حفظت الملفات المستلمة؟ المسح يزيل روابط تنزيلها من هذه الصفحة.': 'Have you saved your received files? Clearing removes their download links from this page.',
    'دعوة ربط جاهزة. اضغط «الاتصال بالجهاز الآخر» للمتابعة.': 'Invitation ready. Select “Connect to other device” to continue.',
    'عرض اختباري فقط — لا توجد جلسة اتصال بهذا الرمز.': 'Test preview only — this code is not an active session.',
    'تم الاستلام على جهازك الآخر': 'Received on your other device', 'تم الاستلام': 'Received',
    'بانتظار الموافقة': 'Waiting for approval', 'في انتظار بدء النقل': 'Waiting for transfer to start',
    'تم إلغاء النقل': 'Transfer canceled', 'إلغاء': 'Cancel', 'قبول': 'Accept', 'إرسال': 'Sending', 'استلام': 'Receiving',
    'الجهاز الآخر': 'Other device', 'أنت': 'You',
    'الملف «': 'File “', '» يتجاوز حد 200 MB.': '” exceeds the 200 MB limit.',
    'اكتمل استلام «': 'Received “', '». اضغط حفظ الملف.': '”. Select Save file.'
  };
  const translationKeys = Object.keys(englishUI).sort((a, b) => b.length - a.length);
  const translationPattern = new RegExp(translationKeys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  let language = 'ar';
  try { language = localStorage.getItem('wasla.ui.language') === 'en' ? 'en' : 'ar'; } catch { /* Storage can be blocked in embeds. */ }
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  if (requestedLanguage === 'ar' || requestedLanguage === 'en') language = requestedLanguage;
  const tr = text => language === 'en' ? String(text).replace(translationPattern, match => englishUI[match]) : String(text);
  const translatedNodes = new WeakMap();
  const translatedAttributes = new WeakMap();
  function skipTranslation(element) {
    return !element || element.closest('script,style,svg,#legacy-pair,.transfer-name,.message p,#session-code,.language-switch,[data-user-content]');
  }
  function renderText(node) {
    if (skipTranslation(node.parentElement) || !node.nodeValue.trim()) return;
    const previous = translatedNodes.get(node);
    const source = previous && node.nodeValue === previous.rendered ? previous.source : node.nodeValue;
    const rendered = tr(source);
    translatedNodes.set(node, { source, rendered });
    if (node.nodeValue !== rendered) node.nodeValue = rendered;
  }
  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) { renderText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) renderText(walker.currentNode);
    const elements = root.querySelectorAll ? [...root.querySelectorAll('[aria-label],[placeholder],[title]')] : [];
    if (root.nodeType === Node.ELEMENT_NODE) elements.push(root);
    for (const element of elements) {
      if (skipTranslation(element)) continue;
      let saved = translatedAttributes.get(element); if (!saved) { saved = {}; translatedAttributes.set(element, saved); }
      for (const attr of ['aria-label', 'placeholder', 'title']) {
        if (!element.hasAttribute(attr)) continue;
        const value = element.getAttribute(attr), previous = saved[attr];
        const source = previous && value === previous.rendered ? previous.source : value;
        const rendered = tr(source); saved[attr] = { source, rendered };
        if (value !== rendered) element.setAttribute(attr, rendered);
      }
    }
  }
  function setLanguage(next, persist = true) {
    language = next === 'en' ? 'en' : 'ar';
    document.documentElement.lang = language; document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    $('lang-ar').setAttribute('aria-pressed', String(language === 'ar'));
    $('lang-en').setAttribute('aria-pressed', String(language === 'en'));
    if (persist) { try { localStorage.setItem('wasla.ui.language', language); } catch { /* Optional preference only. */ } }
    translateTree(document);
  }
  $('lang-ar').onclick = () => setLanguage('ar'); $('lang-en').onclick = () => setLanguage('en');
  setLanguage(language, false);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') renderText(record.target);
      else if (record.type === 'attributes') translateTree(record.target);
      else record.addedNodes.forEach(node => translateTree(node));
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'placeholder', 'title'] });
  const MAX_FILE = 200 * 1024 * 1024;
  const MAX_MEMORY = 300 * 1024 * 1024;
  const CHUNK = 16 * 1024;
  let peer = null, channel = null, session = 0, remoteAccepted = false;
  let broker = null, pendingDevice = null, linkConnection = null, hostCode = '', pairApproved = false;
  let connectionTimer, toastTimer, sending = false, currentIncoming = null, memoryUsed = 0;
  const transfers = new Map();
  let sendQueue = [];
  const ready = () => pairApproved && channel && channel.readyState === 'open';
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const size = n => n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : n >= 1024 ? `${(n / 1024).toFixed(1)} KB` : `${n} B`;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function toast(message) {
    $('toast').textContent = message; $('toast').hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 5000);
  }
  function feedback(message, error = false) {
    $('quick-feedback').textContent = message;
    $('quick-feedback').classList.toggle('error', error);
  }
  function control(message) {
    if (!ready()) throw new Error('الجهاز الآخر غير متصل. اربط الجهازين أولًا.');
    channel.send(JSON.stringify(message));
  }
  function updateConnection(connected, pending = false) {
    $('top-status').textContent = connected ? 'جهازان متصلان الآن' : pending ? 'جارٍ الربط…' : 'لا يوجد اتصال نشط';
    $('top-status').parentElement.classList.toggle('connected', connected);
    $('chat-status').classList.toggle('connected', connected);
    $('chat-status').lastChild.textContent = connected ? ' متصل الآن' : ' بانتظار الاتصال';
    $('connection-label').textContent = connected ? 'أنتما الآن على وصلة واحدة' : pending ? 'بانتظار جهازك الآخر' : 'لنبدأ الاتصال';
    $('connection-title').textContent = connected ? 'أهلًا بجهازك الآخر.' : 'جهازان. وصلة واحدة.';
    $('connection-description').textContent = connected ? 'أرسل ملفاتك أو ابدأ محادثتك. أبقِ الموقع مفتوحًا على الجهازين.' : 'اربط جهازك الآخر لتبدأ إرسال الملفات والرسائل بأمان.';
    $('connect-button').querySelector('span').textContent = connected ? 'قطع الاتصال' : 'ربط جهاز جديد';
  }
  function release(t) {
    if (t.reserved) { memoryUsed -= t.bytes; t.reserved = false; }
    t.parts = []; t.file = null;
  }
  function finish(t, status, label) {
    clearTimeout(t.timer); t.status = status; t.detail.textContent = label;
    t.actions.replaceChildren();
    if (status === 'done') t.fill.style.width = '100%';
    else { release(t); t.fill.style.background = 'var(--error)'; }
  }
  function disconnect(message = '', notify = true) {
    clearTimeout(connectionTimer); session++; pairApproved = false;
    const oldBroker = broker; broker = null; pendingDevice = null; linkConnection = null; hostCode = '';
    if (oldBroker) oldBroker.destroy();
    $('incoming-request').hidden = true; $('session-share').hidden = true;
    $('pair-qr').hidden = true; $('pair-qr').replaceChildren(); $('qr-placeholder').hidden = false;
    const old = peer; peer = null; channel = null;
    if (old) { old.onconnectionstatechange = null; old.close(); }
    remoteAccepted = false; sendQueue = []; currentIncoming = null;
    transfers.forEach(t => { if (!['done', 'failed'].includes(t.status)) finish(t, 'failed', 'توقف النقل — انقطع الاتصال'); });
    updateConnection(false);
    if (message && notify) toast(message);
  }
  function wireChannel(dc, token, waitingApproval = false) {
    channel = dc; dc.binaryType = 'arraybuffer'; dc.bufferedAmountLowThreshold = 128 * 1024;
    dc.onopen = () => {
      if (token !== session || waitingApproval) return;
      pairApproved = true; clearTimeout(connectionTimer); updateConnection(true);
      feedback('تم الربط بنجاح. يمكنك الآن إرسال الملفات والرسائل.');
      if ($('pair-dialog').open) $('pair-dialog').close();
      toast('تم الاتصال بجهازك الآخر بنجاح');
    };
    dc.onmessage = event => {
      if (token !== session) return;
      try {
        if (waitingApproval) {
          if (event.data === '{"type":"paired"}') { waitingApproval = false; dc.onopen(); }
          return;
        }
        receive(event.data);
      } catch (e) { console.warn('Rejected peer data:', e.message); }
    };
    dc.onerror = () => { if (token === session) feedback('حدث خطأ في قناة النقل. أعد الربط.', true); };
    dc.onclose = () => { if (token === session) disconnect('انتهى الاتصال. أعد الربط للمتابعة.'); };
  }
  function createPeer(test = false) {
    if (!window.RTCPeerConnection) throw new Error('متصفحك لا يدعم WebRTC. استخدم إصدارًا حديثًا من Chrome أو Safari.');
    disconnect('', false);
    const token = session;
    const pc = new RTCPeerConnection({ iceServers: test ? [] : [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478' }] });
    peer = pc;
    pc.ondatachannel = e => { if (token === session && !channel) wireChannel(e.channel, token); else e.channel.close(); };
    pc.onconnectionstatechange = () => {
      if (token !== session) return;
      if (pc.connectionState === 'failed') {
        feedback('تعذّر الاتصال المباشر. جرّب شبكة أخرى؛ هذه الشبكة قد تحتاج خادم TURN غير متاح في هذه النسخة.', true);
        disconnect('تعذّر الربط عبر هذه الشبكة. جرّب اتصال إنترنت آخر.');
      } else if (pc.connectionState === 'disconnected') {
        updateConnection(false, true); toast('الاتصال غير مستقر. أبقِ الجهازين متصلين بالإنترنت.');
        clearTimeout(connectionTimer);
        connectionTimer = setTimeout(() => { if (!ready() || pc.connectionState !== 'connected') disconnect('فُقد الاتصال. أعد الربط.'); }, 15000);
      } else if (pc.connectionState === 'connected' && ready()) { clearTimeout(connectionTimer); updateConnection(true); }
    };
    updateConnection(false, true);
    return pc;
  }
  async function gather(pc) {
    if (pc.iceGatheringState === 'complete') return;
    await new Promise(resolve => {
      let timeout;
      const done = () => { clearTimeout(timeout); pc.removeEventListener('icegatheringstatechange', changed); resolve(); };
      const changed = () => { if (pc.iceGatheringState === 'complete') done(); };
      pc.addEventListener('icegatheringstatechange', changed); timeout = setTimeout(done, 12000);
    });
    if (pc !== peer || pc.signalingState === 'closed') throw new Error('تم إلغاء الاتصال. أنشئ رمزًا جديدًا.');
  }
  async function encode(desc) {
    const plain = new TextEncoder().encode(JSON.stringify({ type: desc.type, sdp: desc.sdp }));
    let data = plain, prefix = 'W0.';
    if (typeof CompressionStream !== 'undefined') {
      data = new Uint8Array(await new Response(new Blob([plain]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()); prefix = 'W1.';
    }
    let text = ''; for (const byte of data) text += String.fromCharCode(byte);
    return prefix + btoa(text);
  }
  async function decode(value, type) {
    const text = value.trim().replace(/\s/g, '');
    if (text.length > 100000 || !/^W[01]\./.test(text)) throw new Error('رمز غير صالح. انسخ الرمز كاملًا من موقع وصلة.');
    let data;
    try { data = Uint8Array.from(atob(text.slice(3)), c => c.charCodeAt(0)); } catch { throw new Error('تعذّر قراءة الرمز. تأكد من نسخه كاملًا.'); }
    if (text.startsWith('W1.')) {
      if (typeof DecompressionStream === 'undefined') throw new Error('حدّث متصفحك لقراءة رمز الربط المضغوط.');
      const reader = new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
      let total = 0; const chunks = [];
      while (true) { const { done, value: chunk } = await reader.read(); if (done) break; total += chunk.length; if (total > 150000) { await reader.cancel(); throw new Error('رمز الاتصال أكبر من الحد المسموح.'); } chunks.push(chunk); }
      data = new Uint8Array(total); let offset = 0; chunks.forEach(c => { data.set(c, offset); offset += c.length; });
    }
    let desc;
    try { desc = JSON.parse(new TextDecoder().decode(data)); } catch { throw new Error('رمز الاتصال تالف أو غير مكتمل.'); }
    if (desc.type !== type || typeof desc.sdp !== 'string' || !desc.sdp.startsWith('v=0')) throw new Error(type === 'answer' ? 'هذا ليس رمز رد. استخدم رمزًا من تبويب الانضمام على الجهاز الآخر.' : 'هذا ليس رمز اتصال. أنشئ رمزًا على الجهاز الأول.');
    return { type: desc.type, sdp: desc.sdp };
  }
  function waitForConnection() {
    clearTimeout(connectionTimer);
    connectionTimer = setTimeout(() => {
      if (!ready()) { feedback('استغرق الاتصال وقتًا طويلًا. تحقق من الرمزين أو جرّب شبكة مختلفة؛ قد تحتاج شبكتك إلى TURN.', true); disconnect('', false); }
    }, 45000);
  }
  async function busy(button, task) {
    button.disabled = true;
    try { await task(); } catch (e) { feedback(e.message || 'تعذّر إكمال العملية. حاول مجددًا.', true); }
    finally { button.disabled = false; }
  }
  function tab(join) {
    $('host-view').hidden = join; $('join-view').hidden = !join;
    $('host-tab').classList.toggle('selected', !join); $('join-tab').classList.toggle('selected', join); feedback('');
  }
  $('host-tab').onclick = () => tab(false); $('join-tab').onclick = () => tab(true);
  $('create-offer').onclick = () => busy($('create-offer'), async () => {
    feedback('جارٍ اكتشاف مسارات الاتصال… قد يستغرق ذلك بضع ثوانٍ.');
    $('offer-box').hidden = true; $('answer-input').value = '';
    const pc = createPeer(); wireChannel(pc.createDataChannel('wasla', { ordered: true }), session);
    await pc.setLocalDescription(await pc.createOffer()); await gather(pc);
    if (!pc.localDescription.sdp.includes('a=candidate:')) throw new Error('المتصفح لم يوفّر مسار اتصال. افتح الموقع مباشرة عبر HTTPS خارج المعاينة، وتحقق من إذن WebRTC أو جرّب متصفحًا آخر.');
    $('offer-output').value = await encode(pc.localDescription); $('offer-box').hidden = false;
    feedback('الرمز جاهز. أرسله إلى جهازك الآخر، ثم انتظر رمز الرد منه.');
  });
  $('create-answer').onclick = () => busy($('create-answer'), async () => {
    const desc = await decode($('offer-input').value, 'offer');
    $('answer-box').hidden = true; feedback('جارٍ إنشاء رمز الرد…');
    const pc = createPeer(); await pc.setRemoteDescription(desc);
    await pc.setLocalDescription(await pc.createAnswer()); await gather(pc);
    if (!pc.localDescription.sdp.includes('a=candidate:')) throw new Error('المتصفح لم يوفّر مسار اتصال. افتح الموقع مباشرة عبر HTTPS خارج المعاينة، وتحقق من إذن WebRTC أو جرّب متصفحًا آخر.');
    $('answer-output').value = await encode(pc.localDescription); $('answer-box').hidden = false;
    feedback('انسخ رمز الرد وأرسله للجهاز الأول لإتمام الاتصال.');
  });
  $('accept-answer').onclick = () => busy($('accept-answer'), async () => {
    if (!peer || peer.signalingState !== 'have-local-offer') throw new Error('أنشئ رمز اتصال على هذا الجهاز أولًا.');
    const desc = await decode($('answer-input').value, 'answer');
    await peer.setRemoteDescription(desc); remoteAccepted = true;
    feedback('جارٍ الاتصال بجهازك الآخر…'); waitForConnection();
  });
  $('connect-button').onclick = () => {
    if (ready()) { if (confirm(tr('قطع الاتصال؟ سيتوقف أي نقل جارٍ.'))) disconnect('تم قطع الاتصال.'); }
    else { $('pair-dialog').showModal(); if (peer && remoteAccepted) feedback('بانتظار الاتصال… إن لم ينجح، جرّب شبكة أخرى.'); }
  };
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => $(b.dataset.close).close());
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); } }));
  ['help-button', 'top-help', 'network-info'].forEach(id => $(id).onclick = () => $('help-dialog').showModal());
  document.querySelectorAll('[data-copy]').forEach(b => b.onclick = async () => {
    const area = $(b.dataset.copy);
    try { await navigator.clipboard.writeText(area.value); toast('تم نسخ الرمز. أرسله إلى جهازك الآخر.'); }
    catch { area.focus(); area.select(); toast('حدد الرمز وانسخه يدويًا من القائمة.'); }
  });
  // All application logic stays in this one app.js. Vendor files are unmodified libraries.
  const codePattern = /^[a-f0-9]{16}$/;
  function newSessionCode() {
    return [...crypto.getRandomValues(new Uint8Array(8))].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  function sessionUrl(code) {
    const url = new URL(location.href); url.search = ''; url.hash = `j=${code}`; return url.href;
  }
  function parseSession(value) {
    const text = value.trim(); if (codePattern.test(text)) return text;
    let url; try { url = new URL(text); } catch { throw new Error('الصق رابط الجلسة أو معرّفها المكوّن من 16 محرفًا.'); }
    if (url.origin !== location.origin || url.pathname !== location.pathname || !/^#j=[a-f0-9]{16}$/.test(url.hash)) throw new Error('استخدم رابط جلسة من الصفحة نفسها، وليس رابطًا خارجيًا.');
    return url.hash.slice(3);
  }
  function showQR(code) {
    const url = sessionUrl(code);
    $('session-link').value = url; $('session-code').textContent = code;
    $('session-share').hidden = false;
    try {
      if (typeof qrcode !== 'function') throw new Error();
      const qr = qrcode(0, 'M'); qr.addData(url); qr.make();
      $('pair-qr').innerHTML = qr.createSvgTag({ cellSize: 5, margin: 20, scalable: true });
      $('pair-qr').querySelector('svg').setAttribute('aria-label', 'QR لرابط الجلسة');
      $('pair-qr').hidden = false; $('qr-placeholder').hidden = true;
      $('qr-caption').textContent = 'امسح بكاميرا الهاتف العادية — ثم افتح الرابط';
    } catch { $('qr-caption').textContent = 'تعذّر إنشاء QR؛ انسخ رابط الجلسة أدناه.'; }
  }
  function quickTab(join) {
    $('quick-host').hidden = join; $('quick-join').hidden = !join;
    $('quick-host-tab').classList.toggle('selected', !join); $('quick-join-tab').classList.toggle('selected', join);
  }
  $('quick-host-tab').onclick = () => quickTab(false);
  $('quick-join-tab').onclick = () => quickTab(true);
  function setupBroker(code, target = '') {
    if (typeof Peer !== 'function') throw new Error('لم تُحمّل مكتبة الاتصال. أعد تحميل الصفحة.');
    if (!window.RTCPeerConnection) throw new Error('متصفحك لا يدعم WebRTC.');
    disconnect('', false); const token = session;
    const instance = new Peer(`wasla-${code}`, { host: '0.peerjs.com', port: 443, path: '/', secure: true, debug: 0, config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478' }] } });
    broker = instance; updateConnection(false, true);
    feedback('جارٍ الاتصال بخدمة تنسيق الربط…');
    connectionTimer = setTimeout(() => { if (token === session) { disconnect('', false); feedback('تعذّر الوصول لخدمة الربط. تحقق من الإنترنت وأعد المحاولة.', true); } }, 20000);
    instance.on('open', () => {
      if (token !== session) return; clearTimeout(connectionTimer);
      if (!target) {
        hostCode = code; showQR(code); feedback('الجلسة جاهزة. امسح QR أو افتح رابطها على الجهاز الآخر.');
      } else {
        const conn = instance.connect(`wasla-${target}`, { reliable: true, serialization: 'raw' });
        linkConnection = conn; attachConnection(conn, token, true);
        feedback('جارٍ الاتصال بالجهاز الآخر… ثم انتظر موافقته.');
        connectionTimer = setTimeout(() => { if (token === session && !ready()) { disconnect('', false); feedback('الجلسة غير متاحة أو تعذّر مسار WebRTC. أبقِ الجهاز الأول مفتوحًا أو جرّب شبكة أخرى؛ قد تحتاج TURN.', true); } }, 45000);
      }
    });
    instance.on('connection', conn => {
      if (token !== session || target || pendingDevice || linkConnection || !hostCode) { conn.close(); return; }
      pendingDevice = conn; $('incoming-request').hidden = false;
      feedback('وصل طلب من جهاز. تأكد أنه جهازك ثم وافق عليه.');
      setTimeout(() => { if (pendingDevice === conn) { pendingDevice = null; $('incoming-request').hidden = true; conn.close(); feedback('انتهت مهلة طلب الانضمام. يمكن للجهاز إعادة فتح الرابط.'); } }, 180000);
      conn.on('close', () => { if (pendingDevice === conn) { pendingDevice = null; $('incoming-request').hidden = true; } });
      conn.on('error', () => { if (pendingDevice === conn) { pendingDevice = null; $('incoming-request').hidden = true; feedback('تعذّر الاتصال بالجهاز الطالب.', true); } });
    });
    instance.on('disconnected', () => { if (token === session && !ready()) feedback('انقطع الاتصال بخدمة التنسيق. أنشئ جلسة جديدة.', true); });
    instance.on('error', err => {
      if (token !== session) return;
      const messages = { 'peer-unavailable': 'الجلسة غير موجودة. تأكد من الرابط وبقاء الصفحة الأولى مفتوحة.', 'unavailable-id': 'تعذّر حجز معرّف الجلسة. أنشئ جلسة جديدة.', 'network': 'تعذّر الوصول لخدمة PeerJS العامة. تحقق من اتصالك أو أعد المحاولة لاحقًا.', 'webrtc': 'تعذّر اتصال WebRTC. قد تمنع الشبكة الاتصال المباشر دون TURN.' };
      const text = messages[err.type] || 'تعذّر الربط. تحقق من الإنترنت وجرب جلسة جديدة.';
      if (!ready()) disconnect('', false); feedback(text, true);
    });
  }
  function attachConnection(conn, token, joining) {
    const install = () => {
      if (token !== session) { conn.close(); return; }
      if (!conn.dataChannel) { feedback('تعذّر فتح قناة البيانات.', true); return; }
      wireChannel(conn.dataChannel, token, joining);
      if (joining) {
        clearTimeout(connectionTimer); feedback('وصلنا للجهاز الآخر. بانتظار قبوله…');
        connectionTimer = setTimeout(() => { if (token === session && !ready()) { disconnect('', false); feedback('انتهت مهلة انتظار موافقة الجهاز الآخر. افتح الرابط مجددًا.', true); } }, 180000);
      }
      else {
        clearTimeout(connectionTimer); hostCode = '';
        $('session-share').hidden = true; $('pair-qr').hidden = true;
        conn.dataChannel.send('{"type":"paired"}'); conn.dataChannel.onopen();
      }
    };
    if (conn.open) install(); else conn.on('open', install);
    conn.on('error', () => { if (token === session) { disconnect('', false); feedback('تعذّر مسار البيانات. جرّب شبكة أخرى.', true); } });
    conn.on('close', () => { if (token === session) disconnect('انتهى الاتصال. أنشئ جلسة جديدة.'); });
  }
  $('create-session').onclick = () => { try { setupBroker(newSessionCode()); } catch (e) { feedback(e.message, true); } };
  $('join-session').onclick = () => { try { const code = parseSession($('join-link').value); setupBroker(newSessionCode(), code); } catch (e) { feedback(e.message, true); } };
  $('approve-device').onclick = () => {
    if (!pendingDevice) return;
    const conn = pendingDevice; pendingDevice = null; linkConnection = conn;
    $('incoming-request').hidden = true; feedback('جارٍ فتح قناة البيانات…'); attachConnection(conn, session, false);
  };
  $('reject-device').onclick = () => { pendingDevice?.close(); pendingDevice = null; $('incoming-request').hidden = true; feedback('تم رفض الجهاز. يمكنك مشاركة الرابط مع جهازك الصحيح.'); };
  $('copy-session').onclick = async () => {
    try { await navigator.clipboard.writeText($('session-link').value); toast('تم نسخ رابط الجلسة. افتحه على جهازك الآخر.'); }
    catch { $('session-link').focus(); $('session-link').select(); toast('انسخ الرابط المحدد يدويًا.'); }
  };
  $('nav-transfer').onclick = () => navigate('transfer'); $('nav-chat').onclick = () => navigate('chat');
  function navigate(name) {
    $('nav-transfer').classList.toggle('active', name === 'transfer'); $('nav-chat').classList.toggle('active', name === 'chat');
    $(name === 'chat' ? 'chat-panel' : 'transfer-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (name === 'chat') $('message-input').focus({ preventScroll: true });
  }
  function addMessage(text, sent) {
    $('chat-empty').hidden = true;
    const item = document.createElement('div'); item.className = `message${sent ? ' sent' : ''}`;
    const p = document.createElement('p'); p.dataset.userContent = ''; p.textContent = text;
    const time = document.createElement('time'); time.dateTime = new Date().toISOString();
    time.textContent = `${sent ? 'أنت' : 'الجهاز الآخر'} · ${new Intl.DateTimeFormat(language, { hour: '2-digit', minute: '2-digit' }).format(new Date())}`;
    item.append(p, time); $('chat-messages').append(item);
    while ($('chat-messages').querySelectorAll('.message').length > 300) $('chat-messages').querySelector('.message').remove();
    $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
  }
  $('chat-form').onsubmit = e => {
    e.preventDefault(); const text = $('message-input').value.trim(); if (!text) return;
    if (!ready()) { toast('اربط جهازك الآخر أولًا لإرسال الرسائل.'); $('pair-dialog').showModal(); return; }
    try { control({ type: 'chat', text }); addMessage(text, true); $('message-input').value = ''; }
    catch (err) { toast(err.message); }
  };
  function action(t, label, handler, reject = false) {
    const button = document.createElement('button'); button.textContent = label;
    if (reject) button.className = 'reject'; button.onclick = handler; t.actions.append(button); return button;
  }
  function createTransfer(id, name, bytes, direction, file) {
    $('transfer-empty').hidden = true;
    const row = document.createElement('article'); row.className = 'transfer-item';
    const icon = document.createElement('span'); icon.className = 'empty-icon';
    icon.innerHTML = '<svg aria-hidden="true"><use href="#i-file"/></svg>';
    const info = document.createElement('div'); info.className = 'transfer-info';
    const title = document.createElement('div'); title.className = 'transfer-name'; title.textContent = name; title.title = name;
    const detail = document.createElement('p'); detail.className = 'transfer-detail';
    detail.textContent = `${direction === 'out' ? 'إرسال' : 'استلام'} · ${size(bytes)} · بانتظار الموافقة`;
    const track = document.createElement('div'); track.className = 'progress-track';
    const fill = document.createElement('div'); fill.className = 'progress-fill'; track.append(fill);
    const actions = document.createElement('div'); actions.className = 'transfer-actions';
    info.append(title, detail, track); row.append(icon, info, actions); $('transfers-list').append(row);
    const t = { id, name, bytes, direction, file, row, detail, fill, actions, status: 'offered', received: 0, parts: [], reserved: false, url: null, timer: null };
    transfers.set(id, t); $('transfer-count').textContent = transfers.size; return t;
  }
  function progress(t, bytes) {
    const percent = t.bytes ? Math.min(100, bytes / t.bytes * 100) : 100;
    t.fill.style.width = `${percent}%`;
    const elapsed = (performance.now() - t.started) / 1000;
    const rate = elapsed > .4 ? ` · ${size(bytes / elapsed)}/s` : '';
    t.detail.textContent = `${t.direction === 'out' ? 'إرسال' : 'استلام'} · ${Math.floor(percent)}% · ${size(t.bytes)}${rate}`;
  }
  function cancel(t, label = 'تم إلغاء النقل', inform = true) {
    if (['done', 'failed'].includes(t.status)) return;
    if (inform && ready()) control({ type: 'cancel', id: t.id });
    if (currentIncoming === t) currentIncoming = null;
    finish(t, 'failed', label);
  }
  function offerFiles(files) {
    if (!files.length) return;
    if (!ready()) { toast('اربط الجهازين أولًا، ثم اختر ملفاتك من جديد.'); $('pair-dialog').showModal(); return; }
    for (const file of files) {
      if (file.size > MAX_FILE) { toast(`الملف «${file.name}» يتجاوز حد 200 MB.`); continue; }
      if ([...transfers.values()].filter(t => !['done', 'failed'].includes(t.status)).length >= 20) { toast('يمكنك طلب نقل 20 ملفًا في الوقت نفسه. انتظر اكتمال بعض الملفات.'); break; }
      const t = createTransfer(uid(), file.name.slice(0, 255), file.size, 'out', file);
      action(t, 'إلغاء', () => cancel(t), true);
      control({ type: 'offer', id: t.id, name: t.name, size: t.bytes });
      t.timer = setTimeout(() => cancel(t, 'انتهت مهلة انتظار الموافقة'), 180000);
    }
  }
  const choose = () => $('file-input').click();
  $('choose-files').onclick = e => { e.stopPropagation(); choose(); };
  $('dropzone').onclick = e => { if (e.target !== $('file-input')) choose(); };
  $('dropzone').onkeydown = e => { if (e.target === $('dropzone') && ['Enter', ' '].includes(e.key)) { e.preventDefault(); choose(); } };
  $('file-input').onchange = e => { offerFiles([...e.target.files]); e.target.value = ''; };
  ['dragenter', 'dragover'].forEach(event => $('dropzone').addEventListener(event, e => { e.preventDefault(); $('dropzone').classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach(event => $('dropzone').addEventListener(event, e => { e.preventDefault(); $('dropzone').classList.remove('dragover'); }));
  $('dropzone').addEventListener('drop', e => offerFiles([...e.dataTransfer.files]));
  window.addEventListener('dragover', e => e.preventDefault()); window.addEventListener('drop', e => e.preventDefault());
  function acceptFile(t) {
    if (!ready()) { toast('انقطع الاتصال. أعد ربط الجهازين.'); return; }
    if (memoryUsed + t.bytes > MAX_MEMORY) { toast('الذاكرة المؤقتة ممتلئة. احفظ الملفات المكتملة ثم اضغط «مسح المكتمل».'); return; }
    memoryUsed += t.bytes; t.reserved = true; t.status = 'accepted'; clearTimeout(t.timer);
    t.actions.replaceChildren(); action(t, 'إلغاء', () => cancel(t), true);
    t.detail.textContent = `استلام · ${size(t.bytes)} · في انتظار بدء النقل`;
    control({ type: 'accept', id: t.id });
    armIncoming(t);
  }
  function armIncoming(t) {
    clearTimeout(t.timer);
    t.timer = setTimeout(() => cancel(t, 'توقف النقل: لم تصل بيانات خلال 90 ثانية'), 90000);
  }
  async function backpressure(dc, t) {
    const start = performance.now();
    while (dc.bufferedAmount > 512 * 1024) {
      if (dc.readyState !== 'open' || t.status !== 'sending') throw new Error('توقف النقل');
      if (performance.now() - start > 30000) throw new Error('انتهت مهلة إرسال البيانات');
      await sleep(15);
    }
  }
  async function pump() {
    if (sending) return; sending = true;
    try {
      while (sendQueue.length && ready()) {
        const t = sendQueue.shift(); if (t.status !== 'accepted') continue;
        const dc = channel; t.status = 'sending'; t.started = performance.now();
        try {
          control({ type: 'start', id: t.id });
          for (let offset = 0; offset < t.bytes; offset += CHUNK) {
            if (t.status !== 'sending' || channel !== dc) throw new Error('توقف النقل');
            await backpressure(dc, t);
            const chunk = await t.file.slice(offset, offset + CHUNK).arrayBuffer();
            if (t.status !== 'sending' || !ready() || channel !== dc) throw new Error('توقف النقل');
            dc.send(chunk); progress(t, Math.min(offset + chunk.byteLength, t.bytes));
          }
          if (t.status !== 'sending') throw new Error('توقف النقل');
          await backpressure(dc, t);
          control({ type: 'end', id: t.id }); t.status = 'awaiting';
          t.detail.textContent = 'أُرسلت البيانات · بانتظار تأكيد الاستلام';
          t.timer = setTimeout(() => cancel(t, 'لم يصل تأكيد الاستلام'), 90000);
        } catch (e) { cancel(t, e.message); }
      }
    } finally { sending = false; }
  }
  function receive(data) {
    if (data instanceof ArrayBuffer) {
      const t = currentIncoming; if (!t || t.status !== 'receiving') return;
      if (t.received + data.byteLength > t.bytes || data.byteLength > 65536) { cancel(t, 'تم رفض بيانات بحجم غير مطابق'); return; }
      t.parts.push(data); t.received += data.byteLength; progress(t, t.received); armIncoming(t); return;
    }
    if (typeof data !== 'string' || data.length > 20000) return;
    const msg = JSON.parse(data);
    if (msg.type === 'chat') { if (typeof msg.text === 'string' && msg.text.length <= 4000) addMessage(msg.text, false); return; }
    if (typeof msg.id !== 'string' || msg.id.length > 80) return;
    if (msg.type === 'offer') {
      if (transfers.has(msg.id)) return;
      const active = [...transfers.values()].filter(t => !['failed', 'done'].includes(t.status)).length;
      if (active >= 20 || typeof msg.name !== 'string' || !msg.name || msg.name.length > 255 || !Number.isSafeInteger(msg.size) || msg.size < 0 || msg.size > MAX_FILE) { control({ type: 'reject', id: msg.id }); return; }
      const t = createTransfer(msg.id, msg.name.replace(/[\x00-\x1f\x7f]/g, ''), msg.size, 'in');
      action(t, 'قبول', () => acceptFile(t)); action(t, 'رفض', () => cancel(t, 'تم رفض الملف'), true);
      t.timer = setTimeout(() => cancel(t, 'انتهت مهلة طلب النقل'), 180000); toast('يريد جهازك الآخر إرسال ملف. اضغط «قبول» لبدء النقل.'); return;
    }
    const t = transfers.get(msg.id); if (!t || ['done', 'failed'].includes(t.status)) return;
    switch (msg.type) {
      case 'accept':
        if (t.direction !== 'out' || t.status !== 'offered') return;
        clearTimeout(t.timer); t.status = 'accepted'; sendQueue.push(t); pump(); break;
      case 'start':
        if (t.direction !== 'in' || t.status !== 'accepted') return;
        if (currentIncoming) { cancel(t, 'يوجد نقل آخر قيد الاستلام'); return; }
        t.status = 'receiving'; t.started = performance.now(); currentIncoming = t; armIncoming(t); progress(t, 0); break;
      case 'end':
        if (t.direction !== 'in' || currentIncoming !== t || t.status !== 'receiving') return;
        currentIncoming = null;
        if (t.received !== t.bytes) { cancel(t, 'الملف غير مكتمل. أعد إرساله.'); return; }
        t.url = URL.createObjectURL(new Blob(t.parts, { type: 'application/octet-stream' })); t.parts = [];
        finish(t, 'done', `تم الاستلام · ${size(t.bytes)}`);
        const link = document.createElement('a'); link.className = 'download-link'; link.href = t.url; link.download = t.name; link.textContent = 'حفظ الملف'; t.actions.append(link);
        control({ type: 'received', id: t.id }); toast(`اكتمل استلام «${t.name}». اضغط حفظ الملف.`); break;
      case 'received':
        if (t.direction === 'out' && t.status === 'awaiting') { finish(t, 'done', `تم الاستلام على جهازك الآخر · ${size(t.bytes)}`); t.file = null; } break;
      case 'cancel': case 'reject': cancel(t, msg.type === 'reject' ? 'رفض الجهاز الآخر الملف' : 'ألغى الجهاز الآخر النقل', false); break;
    }
  }
  $('clear-history').onclick = () => {
    const done = [...transfers.values()].filter(t => ['done', 'failed'].includes(t.status));
    if (!done.length) { toast('لا يوجد نشاط مكتمل لمسحه بعد.'); return; }
    if (done.some(t => t.url) && !confirm(tr('هل حفظت الملفات المستلمة؟ المسح يزيل روابط تنزيلها من هذه الصفحة.'))) return;
    done.forEach(t => { if (t.url) URL.revokeObjectURL(t.url); release(t); t.row.remove(); transfers.delete(t.id); });
    $('transfer-count').textContent = transfers.size; $('transfer-empty').hidden = transfers.size > 0;
  };
  window.addEventListener('beforeunload', e => {
    if (ready() || [...transfers.values()].some(t => t.url)) { e.preventDefault(); e.returnValue = ''; }
  });
  // Optional, isolated loopback verification on the actual application page.
  // Never opens STUN or sends test data to an external service.
  async function selfTest() {
    let remote;
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    const until = async (fn, label = 'unspecified') => { for (let i = 0; i < 350; i++) { if (fn()) return; await sleep(30); } throw new Error(`Test timed out: ${label}`); };
    try {
      const sampleCode = newSessionCode();
      assert(parseSession(sessionUrl(sampleCode)) === sampleCode, 'Session URL roundtrip');
      let invalidLink = false; try { parseSession('https://example.invalid/#j=' + sampleCode); } catch { invalidLink = true; }
      assert(invalidLink, 'External URL not rejected');
      showQR(sampleCode);
      assert($('pair-qr').querySelector('svg'), 'QR not generated');
      const gate = { readyState: 'open', bufferedAmount: 0, send() {} };
      wireChannel(gate, session, true);
      gate.onopen(); assert(!ready(), 'Session connected before host approval');
      gate.onmessage({ data: JSON.stringify({ type: 'chat', text: 'blocked-before-approval' }) });
      assert(!$('chat-messages').textContent.includes('blocked-before-approval'), 'Preapproval data accepted');
      gate.onmessage({ data: '{"type":"paired"}' }); assert(ready(), 'Host approval not processed');
      console.log('SELFTEST PASS: random session identifier, URL parsing, external link rejection, QR SVG generation, approval handshake, preapproval messages ignored');
      const pc = createPeer(true); const local = pc.createDataChannel('wasla', { ordered: true }); wireChannel(local, session);
      remote = new RTCPeerConnection({ iceServers: [] }); let other;
      pc.addEventListener('iceconnectionstatechange', () => console.log('SELFTEST local ICE:', pc.iceConnectionState));
      remote.addEventListener('iceconnectionstatechange', () => console.log('SELFTEST remote ICE:', remote.iceConnectionState));
      const messages = [];
      remote.ondatachannel = e => { other = e.channel; other.binaryType = 'arraybuffer'; other.onmessage = m => messages.push(m.data); };
      await pc.setLocalDescription(await pc.createOffer()); await gather(pc);
      const code = await encode(pc.localDescription); await remote.setRemoteDescription(await decode(code, 'offer'));
      let bad = false; try { await decode(code, 'answer'); } catch { bad = true; } assert(bad, 'Wrong code type accepted');
      await remote.setLocalDescription(await remote.createAnswer());
      await until(() => remote.iceGatheringState === 'complete', 'remote ICE gathering');
      await pc.setRemoteDescription(await decode(await encode(remote.localDescription), 'answer'));
      const noCandidates = !pc.localDescription.sdp.includes('a=candidate:') || !remote.localDescription.sdp.includes('a=candidate:');
      if (noCandidates) {
        console.warn('SELFTEST SKIP real WebRTC transport: browser environment supplied zero ICE candidates. Running protocol/UI tests with an in-memory channel, not a network transfer.');
        session++; pc.onconnectionstatechange = null; pc.close(); remote.close(); peer = null;
        channel = { readyState: 'open', bufferedAmount: 0, send: data => messages.push(data) };
        other = { send: data => receive(ArrayBuffer.isView(data) ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data) };
        pairApproved = true; updateConnection(true);
      } else {
        await until(() => ready() && other && other.readyState === 'open', 'data channel open');
        console.log('SELFTEST: real WebRTC channel open');
      }
      other.send(JSON.stringify({ type: 'chat', text: 'اختبار رسالة آمنة <img src=x>' }));
      await until(() => $('chat-messages').textContent.includes('اختبار رسالة آمنة'), 'incoming chat');
      assert(!$('chat-messages').querySelector('img'), 'Chat HTML injection');
      $('message-input').value = 'اختبار الإرسال'; $('chat-form').requestSubmit();
      await until(() => messages.some(m => typeof m === 'string' && JSON.parse(m).type === 'chat'), 'outgoing chat');
      const bytes = Uint8Array.from({ length: 100003 }, (_, i) => i % 251);
      other.send(JSON.stringify({ type: 'offer', id: 'loopback-in', name: 'test.txt', size: bytes.byteLength }));
      await until(() => transfers.has('loopback-in'), 'file offer'); const t = transfers.get('loopback-in');
      t.actions.querySelector('button').click();
      other.send(JSON.stringify({ type: 'start', id: t.id }));
      for (let offset = 0; offset < bytes.length; offset += CHUNK) other.send(bytes.slice(offset, offset + CHUNK));
      other.send(JSON.stringify({ type: 'end', id: t.id }));
      await until(() => t.status === 'done', 'incoming file complete');
      const receivedBytes = new Uint8Array(await (await fetch(t.url)).arrayBuffer());
      assert(receivedBytes.length === bytes.length && receivedBytes.every((b, i) => b === bytes[i]), 'File content mismatch');
      offerFiles([new File([bytes], 'out.txt')]);
      const out = [...transfers.values()].find(t => t.direction === 'out');
      other.send(JSON.stringify({ type: 'accept', id: out.id })); await until(() => out.status === 'awaiting', 'outgoing file sent');
      await until(() => messages.some(m => m instanceof ArrayBuffer), 'remote binary delivery');
      const sentBytes = messages.filter(m => m instanceof ArrayBuffer);
      const sentBlob = new Uint8Array(await new Blob(sentBytes).arrayBuffer());
      assert(sentBytes.length > 1 && sentBlob.length === bytes.length && sentBlob.every((b, i) => b === bytes[i]), 'Outbound file mismatch');
      other.send(JSON.stringify({ type: 'received', id: out.id })); await until(() => out.status === 'done', 'outgoing file acknowledgement');
      console.log(`SELFTEST PASS (${noCandidates ? 'in-memory protocol tests; real transport unverified' : 'real loopback WebRTC'}): SDP encode/decode, invalid code rejection, incoming/outgoing chat, safe text rendering, file consent, binary chunks both ways, exact received content and completion acknowledgement.`);
      remote.close(); disconnect('', false);
    } catch (e) { console.error('SELFTEST FAIL:', e.message); remote?.close(); disconnect('', false); }
  }
  async function languageTest() {
    const assert = (ok, message) => { if (!ok) throw new Error(message); };
    try {
      const gate = { readyState: 'open', bufferedAmount: 0, send() {} };
      wireChannel(gate, session); gate.onopen();
      addMessage('المحادثة — user content stays unchanged', false);
      const item = createTransfer('language-test', 'نقل الملفات.txt', 1234, 'in');
      action(item, 'قبول', () => {}); $('message-input').value = 'مسودة / draft';
      $('quick-feedback').textContent = 'الجلسة جاهزة. امسح QR أو افتح رابطها على الجهاز الآخر.';
      $('lang-en').click(); await sleep(30);
      assert(document.documentElement.dir === 'ltr', 'English direction');
      assert($('top-status').textContent === 'Two devices connected', 'Connected status translation');
      assert(item.detail.textContent.includes('Waiting for approval'), 'Transfer translation');
      assert(item.actions.textContent === 'Accept', 'Action translation');
      assert($('quick-feedback').textContent.startsWith('Session ready.'), 'Pairing translation');
      assert(ready() && channel === gate, 'Language change reset session');
      assert($('message-input').value === 'مسودة / draft', 'Draft changed');
      assert(item.row.querySelector('.transfer-name').textContent === 'نقل الملفات.txt', 'Filename translated');
      assert($('chat-messages').querySelector('.message p').textContent.startsWith('المحادثة'), 'Message translated');
      feedback('الجلسة غير موجودة. تأكد من الرابط وبقاء الصفحة الأولى مفتوحة.', true); await sleep(30);
      assert($('quick-feedback').textContent.startsWith('Session not found.'), 'New error not translated');
      $('lang-ar').click(); await sleep(30);
      assert(document.documentElement.dir === 'rtl' && $('top-status').textContent === 'جهازان متصلان الآن', 'Arabic restore');
      assert(item.actions.textContent === 'قبول', 'Action restore');
      $('lang-en').click(); await sleep(30);
      assert(item.actions.textContent === 'Accept' && ready(), 'Repeat toggle failed');
      console.log('LANGUAGE TEST PASS: switch buttons, RTL/LTR, connected status, pairing errors, transfer actions, repeated toggles; session, draft, filename and user messages preserved.');
      disconnect('', false);
    } catch (error) { console.error('LANGUAGE TEST FAIL:', error.message); }
  }
  if (/^#j=/.test(location.hash)) {
    quickTab(true); $('join-link').value = location.href; $('pair-dialog').showModal();
    feedback('دعوة ربط جاهزة. اضغط «الاتصال بالجهاز الآخر» للمتابعة.');
  }
  if (location.hash === '#connect') $('pair-dialog').showModal();
  if (location.hash === '#help') $('help-dialog').showModal();
  const testMode = new URLSearchParams(location.search).get('selftest');
  if (testMode === '1') selfTest();
  if (testMode === 'language') languageTest();
  if (testMode === 'qr') { $('pair-dialog').showModal(); showQR('0123456789abcdef'); feedback('عرض اختباري فقط — لا توجد جلسة اتصال بهذا الرمز.'); }
  if (testMode === 'broker') {
    $('pair-dialog').showModal(); $('create-session').click();
    setTimeout(() => console.log('BROKER TEST:', hostCode ? 'PASS real signaling registration and QR ready' : $('quick-feedback').textContent), 12000);
  }
})();
