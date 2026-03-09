-- Sample banners
INSERT INTO banners (title, subtitle, image_url, link_url, link_text, sort_order) VALUES
  ('光通信行业领先解决方案', '专注光纤、光缆、光模块及系统集成，服务全球客户', '/images/banner-1.jpg', '/products', '查看产品', 1),
  ('新一代400G光模块', '满足数据中心高速互联需求，支持单模/多模光纤', '/images/banner-2.jpg', '/products/400g-optical-module', '了解详情', 2),
  ('FTTH全光网络解决方案', '端到端光纤到户方案，助力运营商网络升级', '/images/banner-3.jpg', '/products', '了解方案', 3);

-- Sample products
INSERT INTO products (category_id, name, slug, summary, description, specifications, is_featured, sort_order)
SELECT
  pc.id,
  '单模光纤跳线 LC-LC',
  'sm-fiber-patch-cord-lc-lc',
  '低插损、高回损单模光纤跳线，适用于设备间及机房内连接',
  '本产品采用优质单模光纤和精密陶瓷插芯制造，具有插损低、回损高、互换性好等特点。广泛应用于通信网络、数据中心、有线电视等领域。',
  '{"光纤类型": "G.652D 单模", "连接器类型": "LC/UPC-LC/UPC", "插入损耗": "≤0.3dB", "回波损耗": "≥50dB", "工作波长": "1310/1550nm", "护套颜色": "黄色", "护套材料": "PVC", "缆径": "2.0mm 或 3.0mm"}'::jsonb,
  true,
  1
FROM product_categories pc WHERE pc.slug = 'optical-fiber-cables';

INSERT INTO products (category_id, name, slug, summary, description, specifications, is_featured, sort_order)
SELECT
  pc.id,
  'SFP+ 10G 光模块',
  'sfp-plus-10g-optical-module',
  '符合SFP+ MSA标准的10Gbps光收发模块，支持10GBase-LR',
  '该模块采用DFB激光器和PIN光探测器，具有功耗低、传输稳定的特点。广泛用于数据中心、企业网络及运营商网络中的10G以太网及SDH应用。',
  '{"速率": "10.3125 Gbps", "接口类型": "SFP+", "传输距离": "10km", "发射波长": "1310nm", "光纤类型": "单模 (SMF)", "连接器": "LC双工", "工作电压": "3.3V", "功耗": "≤1.5W", "工作温度": "0~70°C"}'::jsonb,
  true,
  1
FROM product_categories pc WHERE pc.slug = 'optical-modules';

INSERT INTO products (category_id, name, slug, summary, description, specifications, is_featured, sort_order)
SELECT
  pc.id,
  '1×8 PLC 分路器',
  'plc-splitter-1x8',
  '平面波导技术制造的1×8光分路器，插损均匀，体积小巧',
  '采用PLC（平面光波导）技术，相比传统FBT熔融拉锥分路器具有更好的均匀性和更宽的工作波长范围，适用于FTTH/GPON/EPON网络分光。',
  '{"分路比": "1×8", "工作波长": "1260~1650nm", "插入损耗": "≤10.8dB", "均匀性": "≤0.8dB", "回波损耗": "≥55dB", "封装类型": "ABS盒式", "连接器": "SC/APC 或 SC/UPC"}'::jsonb,
  true,
  1
FROM product_categories pc WHERE pc.slug = 'passive-optical-components';

-- Sample articles
INSERT INTO articles (title, slug, summary, content, is_featured, is_published, published_at) VALUES
  (
    '400G光模块市场分析：数据中心驱动需求持续增长',
    '400g-optical-module-market-analysis',
    '随着云计算和AI大模型的快速发展，数据中心对高速互联的需求持续上升，400G光模块市场迎来高速增长期。',
    '随着云计算、大数据、人工智能等新兴技术的快速发展，全球数据中心流量持续爆增，对高速光互联的需求日益迫切。400G光模块作为目前数据中心主流高速互联方案，市场需求旺盛。

## 市场现状

据相关机构预测，2024年全球400G光模块出货量将突破2000万只，同比增长超过50%。其中，北美超大规模数据中心厂商依然是最主要的采购方，国内云计算厂商的需求也在快速增长。

## 技术趋势

当前400G光模块主要采用以下几种技术方案：
- **DR4**：采用4路×100G PAM4调制，适用于500m以内的数据中心内部互联
- **FR4**：同样4路×100G，但采用WDM复用，适用于2km连接
- **LR4**：长距离方案，可支持10km传输

## 国产替代加速

在国际贸易摩擦背景下，国内光模块厂商加大研发投入，产品性能逐步提升，部分厂商已实现规模化出货，加速推进光模块国产替代。

## 展望

预计未来两年，800G光模块将逐步进入规模化部署阶段，1.6T光模块的研发也在积极推进中，光通信行业将持续保持高景气度。',
    true,
    true,
    now() - INTERVAL '3 days'
  ),
  (
    'FTTH建设提速，光纤接入网络覆盖持续扩大',
    'ftth-construction-acceleration',
    '工信部数据显示，全国光纤接入端口数量持续增长，千兆光纤用户规模不断扩大，FTTH建设进入新阶段。',
    '近年来，我国加快推进"双千兆"网络建设，光纤到户（FTTH）工程取得显著成效。

## 建设成果

根据工业和信息化部最新数据，我国固定宽带接入用户中，光纤接入用户占比已超过95%，千兆用户规模突破1.5亿户，稳居全球第一。

## 技术升级

随着FTTH建设深入，网络技术也在持续演进：
- **GPON向XGS-PON升级**：支持对称10Gbps速率，满足高清视频、云游戏等高带宽应用需求
- **50G PON标准化**：ITU-T已发布相关标准，国内运营商积极推进试点
- **波分复用PON**：提升现有光纤基础设施利用率

## 产业机遇

FTTH建设提速带动了光纤光缆、分路器、光纤连接器等无源器件，以及OLT、ONU等有源设备的市场需求，为光通信产业链提供了良好发展机遇。',
    true,
    true,
    now() - INTERVAL '7 days'
  ),
  (
    '光纤通信技术发展历程与未来趋势',
    'optical-fiber-communication-history-and-future',
    '从上世纪七十年代的第一条商用光纤线路，到如今的超高速骨干网，光纤通信技术历经五十年发展，正向着更高速率、更大容量迈进。',
    '光纤通信技术自1970年代诞生以来，经历了多代技术演进，深刻改变了全球通信格局。

## 发展历程

**第一代（1980s）**：850nm波段，速率45Mbps，多模光纤

**第二代（1980s末）**：1310nm波段，速率140Mbps，单模光纤，色散最小化

**第三代（1990s）**：1550nm波段，速率2.5Gbps，采用EDFA光放大器

**第四代（2000s）**：DWDM密集波分复用，单纤容量Tbps级

**第五代（当前）**：相干光通信+软件定义，单波400G/800G

## 关键技术突破

- **相干检测**：大幅提升频谱效率，单波速率从100G到400G/800G
- **高阶调制**：16QAM、64QAM等高阶调制格式
- **空分复用（SDM）**：多芯光纤、少模光纤，突破单纤容量极限

## 未来展望

未来光纤通信将向以下方向演进：
1. 单波速率1.6Tbps及以上
2. 空分复用技术商用化
3. 量子通信与经典光纤通信融合
4. 硅光技术降低光模块成本和功耗',
    false,
    true,
    now() - INTERVAL '14 days'
  );
