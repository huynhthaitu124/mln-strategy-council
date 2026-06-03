export type StatKey = 'production' | 'livelihood' | 'technology' | 'solidarity';

export type Stats = Record<StatKey, number>;

export type RepresentativeId = 'workers' | 'farmers' | 'intellectuals' | 'state';

export type PolicyCardId =
  | 'coordination'
  | 'agri-subsidy'
  | 'digital-agri'
  | 'technical-training'
  | 'factory-expansion'
  | 'tax-increase'
  | 'tax-cut'
  | 'interest-fund'
  | 'import-buffer'
  | 'labor-protection'
  | 'research-order'
  | 'market-linkage'
  | 'green-transition'
  | 'anti-corruption'
  | 'regional-linkage'
  | 'credit-coop';

export type PolicyCard = {
  id: PolicyCardId;
  name: string;
  category: string;
  cost: number;
  description: string;
  effects: Partial<Stats>;
  tags: string[];
  sprite: string;
};

export type Representative = {
  id: RepresentativeId;
  name: string;
  role: string;
  expectation: string;
  sprite: string;
};

export type Level = {
  id: number;
  title: string;
  crisis: string;
  objective: string;
  theoryNote: string;
  sourceNote: string;
  budget: number;
  maxCards: number;
  baseStats: Stats;
  thresholds: Stats;
  hand: PolicyCardId[];
  requiredAny?: PolicyCardId[];
  requiredAll?: PolicyCardId[];
  strategyRoutes?: StrategyRoute[];
};

export type StrategyRoute = {
  name: string;
  cards: PolicyCardId[];
  bonus: number;
  description: string;
};

export type ForceMood = 'hài lòng' | 'lo ngại' | 'trung lập';

export type Outcome = {
  stats: Stats;
  selectedCards: PolicyCardId[];
  spentBudget: number;
  remainingBudget: number;
  score: number;
  passed: boolean;
  objectiveMet: boolean;
  failedStats: StatKey[];
  modifiers: string[];
  strategyRoute?: string;
  forceMoods: Record<Exclude<RepresentativeId, 'state'>, ForceMood>;
};

export const statLabels: Record<StatKey, string> = {
  production: 'Năng lực sản xuất',
  livelihood: 'Đời sống nhân dân',
  technology: 'Khoa học - công nghệ',
  solidarity: 'Đoàn kết xã hội',
};

export const statDescriptions: Record<StatKey, string> = {
  production: 'Khả năng tạo ra của cải, sản phẩm và năng suất lao động.',
  livelihood: 'Mức ổn định sinh kế, thu nhập và an sinh của nhân dân.',
  technology: 'Mức ứng dụng tri thức, kỹ thuật và đổi mới vào phát triển.',
  solidarity: 'Mức đồng thuận và gắn kết lợi ích giữa các lực lượng xã hội.',
};

export const representatives: Representative[] = [
  {
    id: 'workers',
    name: 'Công nhân',
    role: 'Nền sản xuất',
    expectation: 'Cần năng suất, việc làm ổn định và đào tạo kỹ thuật.',
    sprite: '/council-assets/representative-worker.png',
  },
  {
    id: 'farmers',
    name: 'Nông dân',
    role: 'Nguồn nguyên liệu',
    expectation: 'Cần ổn định đời sống, đầu ra và hỗ trợ chuyển đổi.',
    sprite: '/council-assets/representative-farmer.png',
  },
  {
    id: 'intellectuals',
    name: 'Trí thức',
    role: 'Khoa học - công nghệ',
    expectation: 'Cần môi trường để chuyển tri thức thành năng lực phát triển.',
    sprite: '/council-assets/representative-intellectual.png',
  },
  {
    id: 'state',
    name: 'Nhà nước',
    role: 'Điều tiết chiến lược',
    expectation: 'Tổ chức, điều hòa lợi ích và giữ định hướng phát triển.',
    sprite: '/council-assets/representative-state.png',
  },
];

export const policyCards: Record<PolicyCardId, PolicyCard> = {
  coordination: {
    id: 'coordination',
    name: 'Điều hòa lợi ích xã hội',
    category: 'Nhà nước',
    cost: 2,
    description: 'Dùng đối thoại, giám sát và dân chủ cơ sở để cân bằng lợi ích công nhân, nông dân, trí thức.',
    effects: { solidarity: 16, livelihood: 4, technology: 4 },
    tags: ['state', 'coordination'],
    sprite: '/council-assets/policy-coordination.png',
  },
  'agri-subsidy': {
    id: 'agri-subsidy',
    name: 'Khoán sản xuất - hợp tác xã mới',
    category: 'Nông nghiệp',
    cost: 3,
    description: 'Trao động lực sản xuất cho nông dân, tổ chức lại hợp tác để giữ sinh kế và nguồn nguyên liệu.',
    effects: { livelihood: 18, solidarity: 8, production: 4 },
    tags: ['farmers', 'livelihood'],
    sprite: '/council-assets/policy-agri-subsidy.png',
  },
  'digital-agri': {
    id: 'digital-agri',
    name: 'Nông nghiệp số - chuỗi giá trị',
    category: 'Kỹ thuật',
    cost: 3,
    description: 'Đưa dữ liệu, truy xuất nguồn gốc, kỹ thuật xanh và thị trường số vào nông nghiệp.',
    effects: { technology: 18, livelihood: 10, production: 6 },
    tags: ['farmers', 'intellectuals', 'technology'],
    sprite: '/council-assets/policy-digital-agri.png',
  },
  'technical-training': {
    id: 'technical-training',
    name: 'Đào tạo nghề - trí thức hóa công nhân',
    category: 'Nhân lực',
    cost: 3,
    description: 'Nâng kỹ năng lao động, gắn nhà máy với trường nghề, viện nghiên cứu và kỹ sư.',
    effects: { technology: 20, production: 14, solidarity: 4 },
    tags: ['workers', 'intellectuals', 'technology'],
    sprite: '/council-assets/policy-technical-training.png',
  },
  'factory-expansion': {
    id: 'factory-expansion',
    name: 'Công nghiệp hỗ trợ - hạ tầng sản xuất',
    category: 'Sản xuất',
    cost: 3,
    description: 'Phát triển hạ tầng, cụm công nghiệp và năng lực nội địa; dễ lệch nếu thiếu nhân lực kỹ thuật.',
    effects: { production: 24, livelihood: 2, solidarity: -8, technology: -4 },
    tags: ['workers', 'production'],
    sprite: '/council-assets/policy-factory-expansion.png',
  },
  'tax-increase': {
    id: 'tax-increase',
    name: 'Quỹ đầu tư công có giám sát',
    category: 'Ngân sách',
    cost: 2,
    description: 'Tập trung nguồn lực cho hạ tầng, khoa học - công nghệ; cần minh bạch để giữ đồng thuận.',
    effects: { production: 10, technology: 10, livelihood: -8, solidarity: -10 },
    tags: ['state', 'budget'],
    sprite: '/council-assets/policy-tax-increase.png',
  },
  'tax-cut': {
    id: 'tax-cut',
    name: 'Hỗ trợ doanh nghiệp và hộ sản xuất',
    category: 'Phục hồi',
    cost: 2,
    description: 'Giảm áp lực chi phí cho doanh nghiệp, hợp tác xã và hộ sản xuất; nguồn lực công nghệ mỏng hơn.',
    effects: { livelihood: 12, production: 8, technology: -8 },
    tags: ['state', 'livelihood'],
    sprite: '/council-assets/policy-tax-cut.png',
  },
  'interest-fund': {
    id: 'interest-fund',
    name: 'An sinh - nhà ở - phúc lợi lao động',
    category: 'Phúc lợi',
    cost: 3,
    description: 'Chăm lo nhà ở, y tế, giáo dục và phúc lợi để giảm đứt gãy giữa tăng trưởng và đời sống.',
    effects: { solidarity: 20, livelihood: 8 },
    tags: ['state', 'solidarity'],
    sprite: '/council-assets/policy-interest-fund.png',
  },
  'import-buffer': {
    id: 'import-buffer',
    name: 'Dự phòng chuỗi cung ứng chiến lược',
    category: 'Ứng phó',
    cost: 2,
    description: 'Bảo đảm lương thực, nguyên liệu và logistics khi khủng hoảng; phải đi cùng tự chủ nội lực.',
    effects: { production: 16, livelihood: 6, solidarity: -8 },
    tags: ['state', 'production'],
    sprite: '/council-assets/policy-import-buffer.png',
  },
  'labor-protection': {
    id: 'labor-protection',
    name: 'Bảo vệ lao động và tiền lương',
    category: 'Công nhân',
    cost: 2,
    description: 'Giữ an toàn lao động, tiền lương và quan hệ lao động hài hòa khi sản xuất tăng tốc.',
    effects: { livelihood: 12, solidarity: 12, production: -4 },
    tags: ['workers', 'solidarity'],
    sprite: '/council-assets/policy-interest-fund.png',
  },
  'research-order': {
    id: 'research-order',
    name: 'Đặt hàng nghiên cứu ứng dụng',
    category: 'Tri thức',
    cost: 2,
    description: 'Đặt bài toán thực tế cho trường, viện, kỹ sư để tri thức đi thẳng vào sản xuất.',
    effects: { technology: 16, production: 10, solidarity: 2 },
    tags: ['intellectuals', 'technology'],
    sprite: '/council-assets/policy-technical-training.png',
  },
  'market-linkage': {
    id: 'market-linkage',
    name: 'Liên kết thị trường - xuất khẩu',
    category: 'Thị trường',
    cost: 2,
    description: 'Kết nối hợp tác xã, doanh nghiệp chế biến và thị trường để tăng đầu ra cho sản xuất.',
    effects: { production: 14, livelihood: 10, solidarity: -4 },
    tags: ['farmers', 'production'],
    sprite: '/council-assets/policy-digital-agri.png',
  },
  'green-transition': {
    id: 'green-transition',
    name: 'Chuyển đổi xanh có lộ trình',
    category: 'Bền vững',
    cost: 3,
    description: 'Đổi mới công nghệ sạch và tiêu chuẩn xanh, có chi phí ngắn hạn nhưng tăng năng lực dài hạn.',
    effects: { technology: 18, solidarity: 8, livelihood: 6, production: -6 },
    tags: ['technology', 'solidarity'],
    sprite: '/council-assets/policy-digital-agri.png',
  },
  'anti-corruption': {
    id: 'anti-corruption',
    name: 'Minh bạch và chống lợi ích nhóm',
    category: 'Nhà nước',
    cost: 2,
    description: 'Giám sát phân bổ nguồn lực để giảm thất thoát, tăng niềm tin và hiệu quả chính sách.',
    effects: { solidarity: 14, production: 6, technology: 4 },
    tags: ['state', 'coordination'],
    sprite: '/council-assets/policy-coordination.png',
  },
  'regional-linkage': {
    id: 'regional-linkage',
    name: 'Liên kết vùng và logistics',
    category: 'Hạ tầng',
    cost: 3,
    description: 'Nối vùng nguyên liệu, cảng, nhà máy và đô thị để giảm đứt gãy giữa nông thôn - công nghiệp.',
    effects: { production: 18, livelihood: 8, solidarity: 8 },
    tags: ['state', 'production'],
    sprite: '/council-assets/policy-import-buffer.png',
  },
  'credit-coop': {
    id: 'credit-coop',
    name: 'Tín dụng hợp tác xã',
    category: 'Nông nghiệp',
    cost: 2,
    description: 'Cho hợp tác xã và hộ sản xuất vay vốn có điều kiện để tăng đầu tư nhưng vẫn giữ liên kết.',
    effects: { production: 8, livelihood: 14, solidarity: 6, technology: -2 },
    tags: ['farmers', 'livelihood'],
    sprite: '/council-assets/policy-tax-cut.png',
  },
};

export const levels: Level[] = [
  {
    id: 1,
    title: '1976-1985: Hậu chiến và khan hiếm lương thực',
    crisis: 'Đất nước thống nhất nhưng sản xuất thấp, thiếu lương thực, cơ chế bao cấp làm động lực lao động suy giảm. Công nhân cần việc làm và vật tư, nông dân cần quyền chủ động sản xuất, trí thức cần được đưa vào cải tiến kỹ thuật thay vì chỉ làm kế hoạch giấy.',
    objective: 'Khôi phục sản xuất, bảo đảm đời sống tối thiểu và tạo cơ chế liên minh thực chất giữa nhà máy - đồng ruộng - tri thức kỹ thuật.',
    theoryNote:
      'Trong thời kỳ quá độ, liên minh không thể chỉ là khẩu hiệu chính trị; nó phải xuất phát từ lợi ích kinh tế cụ thể của công nghiệp, nông nghiệp và khoa học - công nghệ.',
    sourceNote: 'Gợi từ giáo trình Chủ nghĩa xã hội khoa học về liên minh giai cấp và kinh nghiệm lịch sử hậu chiến trước Đổi mới.',
    budget: 8,
    maxCards: 3,
    baseStats: { production: 42, livelihood: 42, technology: 42, solidarity: 44 },
    thresholds: { production: 58, livelihood: 58, technology: 58, solidarity: 58 },
    hand: [
      'coordination',
      'agri-subsidy',
      'technical-training',
      'tax-cut',
      'factory-expansion',
      'credit-coop',
      'anti-corruption',
    ],
    strategyRoutes: [
      {
        name: 'Ổn định xã hội trước',
        cards: ['coordination', 'agri-subsidy', 'technical-training'],
        bonus: 140,
        description: 'Khôi phục từ nền tảng liên minh cân bằng, ít rủi ro nhưng không bứt phá mạnh.',
      },
      {
        name: 'Giải phóng động lực nông nghiệp',
        cards: ['agri-subsidy', 'credit-coop', 'technical-training'],
        bonus: 220,
        description: 'Ưu tiên nông dân và hợp tác xã, đồng thời bổ sung kỹ thuật để xử lý nhanh khan hiếm lương thực.',
      },
      {
        name: 'Khôi phục sản xuất có kỷ luật',
        cards: ['factory-expansion', 'technical-training', 'anti-corruption'],
        bonus: 260,
        description: 'Tập trung vào năng suất và chống thất thoát để tái khởi động khu vực sản xuất.',
      },
    ],
  },
  {
    id: 2,
    title: '1986-1995: Đổi mới và động lực thị trường',
    crisis: 'Đổi mới mở ra cơ chế thị trường định hướng xã hội chủ nghĩa, nhưng nếu chỉ kích thích sản xuất mà không tổ chức lại hợp tác, nông dân có thể bị thương lái ép giá, công nhân thiếu nguyên liệu ổn định, còn trí thức chưa có môi trường chuyển giao kỹ thuật.',
    objective: 'Tạo động lực sản xuất cho nông dân, nối nông nghiệp với công nghiệp chế biến và đưa kỹ thuật vào chuỗi giá trị.',
    theoryNote:
      'Đổi mới đúng hướng không phải buông lỏng vai trò Nhà nước, mà là giải phóng sức sản xuất đồng thời tổ chức lại lợi ích để giữ định hướng xã hội chủ nghĩa.',
    sourceNote: 'Gợi từ đường lối Đổi mới, kinh nghiệm khoán trong nông nghiệp và yêu cầu gắn nông dân với khoa học - công nghệ.',
    budget: 8,
    maxCards: 3,
    baseStats: { production: 40, livelihood: 38, technology: 40, solidarity: 46 },
    thresholds: { production: 55, livelihood: 72, technology: 64, solidarity: 60 },
    hand: ['agri-subsidy', 'digital-agri', 'market-linkage', 'credit-coop', 'tax-cut', 'coordination', 'research-order'],
    strategyRoutes: [
      {
        name: 'Khoán và hợp tác xã',
        cards: ['agri-subsidy', 'digital-agri', 'coordination'],
        bonus: 180,
        description: 'Tăng động lực nông dân, giữ liên kết hợp tác và ổn định đời sống.',
      },
      {
        name: 'Nông nghiệp hàng hóa',
        cards: ['agri-subsidy', 'digital-agri', 'market-linkage'],
        bonus: 240,
        description: 'Đẩy mạnh đầu ra thị trường, điểm cao hơn nhưng dễ giảm đoàn kết nếu thiếu điều hòa.',
      },
      {
        name: 'Kỹ thuật hóa nông nghiệp',
        cards: ['digital-agri', 'research-order', 'agri-subsidy'],
        bonus: 300,
        description: 'Đưa trí thức vào nông nghiệp sớm, tạo điểm công nghệ cao nhất.',
      },
    ],
  },
  {
    id: 3,
    title: '1996-2010: Công nghiệp hóa và dịch chuyển lao động',
    crisis: 'Khu công nghiệp, FDI và đô thị hóa tăng nhanh. Lao động nông thôn chuyển vào nhà máy nhưng kỹ năng chưa đủ, phúc lợi đô thị chưa theo kịp, còn trí thức kỹ thuật chưa gắn chặt với công nhân trên dây chuyền.',
    objective: 'Hiện đại hóa sản xuất bằng đào tạo nghề, công nghiệp hỗ trợ và cơ chế phúc lợi để quá trình chuyển dịch không tạo bất ổn xã hội.',
    theoryNote:
      'Công nghiệp hóa không chỉ là tăng số nhà máy; giai cấp công nhân phải được nâng cao tri thức, còn nông dân chuyển dịch phải có sinh kế và kỹ năng mới.',
    sourceNote: 'Gợi từ Nghị quyết 20-NQ/TW về xây dựng giai cấp công nhân và Nghị quyết 29-NQ/TW về công nghiệp hóa, hiện đại hóa.',
    budget: 8,
    maxCards: 3,
    baseStats: { production: 44, livelihood: 42, technology: 42, solidarity: 46 },
    thresholds: { production: 76, livelihood: 52, technology: 76, solidarity: 58 },
    hand: [
      'factory-expansion',
      'technical-training',
      'research-order',
      'labor-protection',
      'tax-increase',
      'coordination',
      'tax-cut',
    ],
    strategyRoutes: [
      {
        name: 'Công nghiệp hỗ trợ',
        cards: ['factory-expansion', 'technical-training', 'coordination'],
        bonus: 180,
        description: 'Đường lối cân bằng giữa hạ tầng, nhân lực và đồng thuận.',
      },
      {
        name: 'Năng suất kỹ thuật cao',
        cards: ['factory-expansion', 'technical-training', 'research-order'],
        bonus: 320,
        description: 'Tối đa hóa sản xuất và công nghệ, điểm cao nhưng phúc lợi mỏng hơn.',
      },
      {
        name: 'Công nghiệp hóa bao trùm',
        cards: ['factory-expansion', 'technical-training', 'labor-protection'],
        bonus: 260,
        description: 'Không tăng hạ tầng quá nhanh, bù lại giữ quan hệ lao động và hiệu quả đầu tư công.',
      },
    ],
  },
  {
    id: 4,
    title: '2011-2020: Hội nhập, năng suất và khoảng cách lợi ích',
    crisis: 'Hội nhập sâu làm cạnh tranh gay gắt hơn. Công nhân chịu áp lực năng suất và chi phí sống, nông dân gặp rủi ro thị trường, trí thức cần môi trường sáng tạo, trong khi khoảng cách lợi ích có thể làm suy giảm đoàn kết xã hội.',
    objective: 'Điều hòa lợi ích bằng phúc lợi, dân chủ cơ sở và đầu tư công có giám sát để tăng trưởng không tách khỏi công bằng.',
    theoryNote:
      'Liên minh bền vững đòi hỏi Nhà nước phát hiện và giải quyết mâu thuẫn lợi ích ngay trong quá trình phát triển, không đợi khủng hoảng bùng phát.',
    sourceNote: 'Gợi từ Văn kiện Đại hội XIII về kinh tế thị trường định hướng xã hội chủ nghĩa có quản lý của Nhà nước và nền tảng đại đoàn kết.',
    budget: 8,
    maxCards: 3,
    baseStats: { production: 44, livelihood: 42, technology: 44, solidarity: 38 },
    thresholds: { production: 48, livelihood: 62, technology: 40, solidarity: 78 },
    hand: ['interest-fund', 'coordination', 'labor-protection', 'anti-corruption', 'tax-cut', 'agri-subsidy', 'tax-increase'],
    strategyRoutes: [
      {
        name: 'Phúc lợi lao động',
        cards: ['interest-fund', 'labor-protection', 'coordination'],
        bonus: 240,
        description: 'Giải quyết trực tiếp áp lực đời sống và quan hệ lao động.',
      },
      {
        name: 'Minh bạch phân phối lợi ích',
        cards: ['anti-corruption', 'coordination', 'tax-increase'],
        bonus: 280,
        description: 'Tăng niềm tin xã hội, phù hợp khi đầu tư công phải đi cùng giám sát.',
      },
      {
        name: 'Ổn định nông thôn - đô thị',
        cards: ['interest-fund', 'coordination', 'tax-cut'],
        bonus: 170,
        description: 'An toàn và dễ qua, nhưng điểm công nghệ thấp hơn các đường lối cải cách thể chế.',
      },
    ],
  },
  {
    id: 5,
    title: '2021-2030: Khí hậu, dịch bệnh và chuỗi cung ứng',
    crisis: 'Sau đại dịch và trước biến đổi khí hậu, sản xuất có thể thiếu nguyên liệu, logistics đứt gãy, nông thôn chịu hạn mặn, còn lao động dễ mất việc. Nếu chỉ nhập bù và cứu nguy ngắn hạn, liên minh nội lực sẽ yếu đi.',
    objective: 'Bảo đảm dự phòng chiến lược nhưng phải đi cùng nông nghiệp số, đào tạo lại lao động và điều phối lợi ích giữa vùng nông thôn - đô thị - công nghiệp.',
    theoryNote:
      'Vai trò Nhà nước trong thời kỳ quá độ là tổ chức năng lực tự chủ: bảo đảm an sinh, hạ tầng, khoa học - công nghệ và liên kết vùng để xã hội chống chịu tốt hơn.',
    sourceNote: 'Gợi từ Nghị quyết 19-NQ/TW về nông nghiệp, nông dân, nông thôn đến 2030, tầm nhìn 2045 và Chiến lược thủy lợi ứng phó hạn mặn, thiên tai.',
    budget: 11,
    maxCards: 4,
    baseStats: { production: 40, livelihood: 42, technology: 44, solidarity: 44 },
    thresholds: { production: 74, livelihood: 64, technology: 62, solidarity: 64 },
    hand: [
      'import-buffer',
      'regional-linkage',
      'coordination',
      'technical-training',
      'agri-subsidy',
      'digital-agri',
      'green-transition',
      'tax-increase',
    ],
    strategyRoutes: [
      {
        name: 'Dự phòng khẩn cấp',
        cards: ['import-buffer', 'coordination', 'regional-linkage', 'technical-training'],
        bonus: 130,
        description: 'Cứu nguy nhanh, điểm thấp hơn vì ít tạo năng lực tự chủ dài hạn.',
      },
      {
        name: 'Tự chủ chuỗi cung ứng',
        cards: ['import-buffer', 'regional-linkage', 'green-transition', 'coordination'],
        bonus: 320,
        description: 'Tạo năng lực chống chịu cao bằng logistics, tiêu chuẩn xanh và dự phòng chiến lược.',
      },
      {
        name: 'Thích ứng khí hậu số',
        cards: ['digital-agri', 'green-transition', 'regional-linkage', 'coordination'],
        bonus: 360,
        description: 'Điểm cao nhất nếu chuyển khủng hoảng thành năng lực nông nghiệp xanh và dữ liệu.',
      },
    ],
  },
  {
    id: 6,
    title: '2030-2045: Kinh tế tri thức xanh',
    crisis: 'Mục tiêu phát triển nhanh và bền vững đòi hỏi công nghệ cao, chuyển đổi xanh, nông nghiệp thông minh và lao động kỹ năng mới. Nếu trí thức bị tách khỏi công nhân - nông dân, đổi mới sáng tạo sẽ không thành năng lực xã hội rộng rãi.',
    objective: 'Đặt tri thức vào trung tâm nhưng phải truyền được thành năng suất của công nhân, nông dân và thành đồng thuận xã hội trong chuyển đổi xanh.',
    theoryNote:
      'Kinh tế tri thức chỉ phù hợp định hướng xã hội chủ nghĩa khi thành quả khoa học - công nghệ được xã hội hóa qua giáo dục, đào tạo, sản xuất và phúc lợi.',
    sourceNote: 'Gợi từ Nghị quyết 45-NQ/TW về đội ngũ trí thức, Nghị quyết 29-NQ/TW về công nghiệp hóa, hiện đại hóa và tầm nhìn phát triển đến 2045.',
    budget: 11,
    maxCards: 4,
    baseStats: { production: 44, livelihood: 44, technology: 46, solidarity: 44 },
    thresholds: { production: 68, livelihood: 68, technology: 84, solidarity: 72 },
    hand: [
      'digital-agri',
      'technical-training',
      'research-order',
      'green-transition',
      'interest-fund',
      'coordination',
      'tax-cut',
      'tax-increase',
      'anti-corruption',
    ],
    strategyRoutes: [
      {
        name: 'Kinh tế tri thức bao trùm',
        cards: ['digital-agri', 'technical-training', 'interest-fund', 'coordination'],
        bonus: 260,
        description: 'Đường lối cân bằng, bảo đảm đổi mới không bỏ lại đời sống nhân dân.',
      },
      {
        name: 'Đổi mới sáng tạo tăng tốc',
        cards: ['digital-agri', 'technical-training', 'research-order', 'interest-fund'],
        bonus: 420,
        description: 'Điểm công nghệ cao nhất, đổi lại cần chấp nhận áp lực xã hội ngắn hạn.',
      },
      {
        name: 'Chuyển đổi xanh đồng thuận',
        cards: ['digital-agri', 'green-transition', 'research-order', 'interest-fund'],
        bonus: 380,
        description: 'Tối ưu bền vững và niềm tin xã hội, không chỉ chạy theo tăng trưởng ngắn hạn.',
      },
    ],
  },
];

const statKeys: StatKey[] = ['production', 'livelihood', 'technology', 'solidarity'];

function clampStat(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function has(cards: Set<PolicyCardId>, id: PolicyCardId) {
  return cards.has(id);
}

function applyEffect(stats: Stats, effect: Partial<Stats>) {
  for (const key of statKeys) {
    stats[key] += effect[key] ?? 0;
  }
}

function getMatchedRoute(level: Level, selectedSet: Set<PolicyCardId>) {
  const matchedRoutes = level.strategyRoutes?.filter((route) => route.cards.every((id) => selectedSet.has(id))) ?? [];
  return matchedRoutes.sort((a, b) => b.bonus - a.bonus || b.cards.length - a.cards.length)[0];
}

export function uniqueSelectedCards(cards: PolicyCardId[], hand: PolicyCardId[]) {
  const seen = new Set<PolicyCardId>();
  return cards.filter((card) => {
    if (!hand.includes(card) || seen.has(card)) return false;
    seen.add(card);
    return true;
  });
}

export function calculateOutcome(level: Level, selected: PolicyCardId[]): Outcome {
  const selectedCards = uniqueSelectedCards(selected, level.hand).slice(0, level.maxCards);
  const selectedSet = new Set(selectedCards);
  const stats: Stats = { ...level.baseStats };
  const modifiers: string[] = [];
  const spentBudget = selectedCards.reduce((sum, id) => sum + policyCards[id].cost, 0);

  for (const id of selectedCards) {
    applyEffect(stats, policyCards[id].effects);
  }

  if (has(selectedSet, 'factory-expansion') && has(selectedSet, 'technical-training')) {
    applyEffect(stats, { production: 12, livelihood: 8, technology: 20, solidarity: 6 });
    modifiers.push('Công nghiệp hỗ trợ đi cùng đào tạo nghề nên hạ tầng sản xuất chuyển thành năng suất thật.');
  }

  if (has(selectedSet, 'factory-expansion') && !has(selectedSet, 'technical-training')) {
    applyEffect(stats, { technology: -10, solidarity: -8 });
    modifiers.push('Mở rộng hạ tầng sản xuất thiếu đào tạo nghề làm công nghệ và đồng thuận xã hội chịu áp lực.');
  }

  if (has(selectedSet, 'agri-subsidy') && has(selectedSet, 'digital-agri')) {
    applyEffect(stats, { livelihood: 10, technology: 10, production: 6, solidarity: 4 });
    modifiers.push('Khoán sản xuất kết hợp nông nghiệp số biến động lực nông dân thành năng lực phát triển dài hạn.');
  }

  if (has(selectedSet, 'digital-agri') && has(selectedSet, 'technical-training')) {
    applyEffect(stats, { production: 8, technology: 8 });
    modifiers.push('Nông nghiệp số kết hợp đào tạo kỹ thuật tạo cầu nối Trí thức với lực lượng sản xuất.');
  }

  if (has(selectedSet, 'research-order') && has(selectedSet, 'technical-training')) {
    applyEffect(stats, { production: 8, technology: 10 });
    modifiers.push('Đặt hàng nghiên cứu đi cùng đào tạo nghề giúp tri thức chuyển hóa trực tiếp thành năng suất.');
  }

  if (has(selectedSet, 'research-order') && has(selectedSet, 'factory-expansion')) {
    applyEffect(stats, { solidarity: 8, technology: 4 });
    modifiers.push('Đặt hàng nghiên cứu cho công nghiệp hỗ trợ làm đầu tư sản xuất minh bạch mục tiêu và dễ tạo đồng thuận hơn.');
  }

  if (has(selectedSet, 'research-order') && has(selectedSet, 'interest-fund')) {
    applyEffect(stats, { livelihood: 8, solidarity: 8 });
    modifiers.push('Đặt hàng nghiên cứu đi cùng phúc lợi giúp tri thức được xã hội hóa thay vì chỉ phục vụ nhóm hẹp.');
  }

  if (has(selectedSet, 'labor-protection') && has(selectedSet, 'factory-expansion')) {
    applyEffect(stats, { livelihood: 8, solidarity: 8, production: -2 });
    modifiers.push('Tăng công suất đi cùng bảo vệ lao động giúp giảm xung đột trong công nghiệp hóa.');
  }

  if (has(selectedSet, 'labor-protection') && has(selectedSet, 'coordination')) {
    applyEffect(stats, { production: 8, livelihood: 4 });
    modifiers.push('Bảo vệ lao động có cơ chế đối thoại giúp giảm đình trệ và giữ nhịp sản xuất ổn định.');
  }

  if (has(selectedSet, 'anti-corruption') && has(selectedSet, 'factory-expansion')) {
    applyEffect(stats, { livelihood: 8, solidarity: 4 });
    modifiers.push('Chống thất thoát trong hạ tầng sản xuất giúp vật tư và lợi ích phục hồi đến được đời sống lao động.');
  }

  if (has(selectedSet, 'market-linkage') && has(selectedSet, 'agri-subsidy')) {
    applyEffect(stats, { production: 8, livelihood: 8 });
    modifiers.push('Hợp tác xã gắn thị trường giúp nông dân không chỉ sản xuất nhiều hơn mà còn bán tốt hơn.');
  }

  if (has(selectedSet, 'market-linkage') && has(selectedSet, 'digital-agri')) {
    applyEffect(stats, { production: 6, technology: 4, solidarity: 8 });
    modifiers.push('Liên kết thị trường có dữ liệu số giúp giảm rủi ro ép giá và tăng niềm tin của nông dân.');
  }

  if (has(selectedSet, 'green-transition') && has(selectedSet, 'research-order')) {
    applyEffect(stats, { technology: 12, solidarity: 6 });
    modifiers.push('Chuyển đổi xanh có đặt hàng nghiên cứu tạo lợi thế dài hạn thay vì chỉ tăng tiêu chuẩn.');
  }

  if (has(selectedSet, 'green-transition') && has(selectedSet, 'digital-agri')) {
    applyEffect(stats, { production: 14, livelihood: 4 });
    modifiers.push('Nông nghiệp số làm chuyển đổi xanh tạo thêm năng suất thay vì chỉ tăng chi phí tuân thủ.');
  }

  if (has(selectedSet, 'green-transition') && has(selectedSet, 'regional-linkage')) {
    applyEffect(stats, { production: 8, livelihood: 6 });
    modifiers.push('Chuyển đổi xanh đi cùng liên kết vùng giúp tiêu chuẩn mới trở thành năng lực sản xuất.');
  }

  if (has(selectedSet, 'green-transition') && has(selectedSet, 'coordination')) {
    applyEffect(stats, { solidarity: 8, livelihood: 4 });
    modifiers.push('Chuyển đổi xanh có điều phối lợi ích giúp giảm chi phí xã hội ngắn hạn.');
  }

  if (has(selectedSet, 'regional-linkage') && has(selectedSet, 'import-buffer')) {
    applyEffect(stats, { production: 10, livelihood: 6 });
    modifiers.push('Dự phòng đi cùng liên kết vùng biến ứng phó ngắn hạn thành năng lực chuỗi cung ứng.');
  }

  if (has(selectedSet, 'tax-increase') && has(selectedSet, 'coordination')) {
    applyEffect(stats, { solidarity: 10, livelihood: 6, technology: 4 });
    modifiers.push('Đầu tư công có giám sát và điều hòa lợi ích nên giảm phản ứng xã hội, giữ niềm tin chung.');
  }

  if (has(selectedSet, 'tax-increase') && has(selectedSet, 'anti-corruption')) {
    applyEffect(stats, { production: 4, livelihood: 18, technology: 4, solidarity: 10 });
    modifiers.push('Quỹ đầu tư công có chống lợi ích nhóm giúp nguồn lực tập trung không làm đời sống bị hy sinh vô hình.');
  }

  if (has(selectedSet, 'tax-increase') && has(selectedSet, 'tax-cut')) {
    applyEffect(stats, { solidarity: -14, production: -6 });
    modifiers.push('Vừa tập trung quỹ đầu tư công vừa hỗ trợ giảm chi phí đại trà tạo tín hiệu chính sách mâu thuẫn.');
  }

  if (has(selectedSet, 'interest-fund') && has(selectedSet, 'coordination')) {
    applyEffect(stats, { solidarity: 14, livelihood: 6 });
    modifiers.push('An sinh, nhà ở và phúc lợi đặt trong cơ chế đối thoại làm đoàn kết xã hội tăng mạnh.');
  }

  if (has(selectedSet, 'import-buffer') && has(selectedSet, 'coordination')) {
    applyEffect(stats, { production: 8, livelihood: 4, solidarity: 8 });
    modifiers.push('Dự phòng chuỗi cung ứng được điều phối nên cứu sản xuất mà không làm liên kết nội lực suy yếu.');
  }

  if (has(selectedSet, 'import-buffer') && !has(selectedSet, 'coordination') && level.id >= 5) {
    applyEffect(stats, { solidarity: -8, technology: -4 });
    modifiers.push('Dự phòng chuỗi cung ứng thiếu điều phối tạo tâm lý phụ thuộc và giảm tự chủ.');
  }

  if (spentBudget > level.budget) {
    applyEffect(stats, { solidarity: -18, livelihood: -8 });
    modifiers.push('Vượt ngân sách làm chính sách mất tính khả thi và giảm đồng thuận xã hội.');
  }

  for (const key of statKeys) {
    stats[key] = clampStat(stats[key]);
  }

  const failedStats = statKeys.filter((key) => stats[key] < level.thresholds[key]);
  const matchedRoute = getMatchedRoute(level, selectedSet);
  const requiredAllMet = !level.requiredAll || level.requiredAll.every((id) => selectedSet.has(id));
  const requiredAnyMet = !level.requiredAny || level.requiredAny.some((id) => selectedSet.has(id));
  const objectiveMet = requiredAllMet && requiredAnyMet && spentBudget <= level.budget;
  const passed = failedStats.length === 0 && objectiveMet;
  const avgStats = statKeys.reduce((sum, key) => sum + stats[key], 0) / statKeys.length;
  const remainingBudget = Math.max(0, level.budget - spentBudget);
  const minStat = Math.min(...statKeys.map((key) => stats[key]));
  const maxStat = Math.max(...statKeys.map((key) => stats[key]));
  const balanceBonus = Math.max(0, 120 - (maxStat - minStat) * 4);
  const excellenceBonus = statKeys.reduce((sum, key) => sum + Math.max(0, stats[key] - level.thresholds[key]) * 7, 0);
  const routeBonus = matchedRoute?.bonus ?? 0;
  const score = Math.round(
    avgStats * 10
      + minStat * 3
      + excellenceBonus
      + balanceBonus
      + routeBonus
      + remainingBudget * 65
      + level.id * 250
      + (passed ? 400 : 0),
  );

  if (matchedRoute) {
    modifiers.unshift(`Đường lối: ${matchedRoute.name}. ${matchedRoute.description}`);
  }

  return {
    stats,
    selectedCards,
    spentBudget,
    remainingBudget,
    score,
    passed,
    objectiveMet,
    failedStats,
    modifiers,
    strategyRoute: matchedRoute?.name,
    forceMoods: {
      workers: stats.production >= level.thresholds.production ? 'hài lòng' : 'lo ngại',
      farmers: stats.livelihood >= level.thresholds.livelihood ? 'hài lòng' : 'lo ngại',
      intellectuals: stats.technology >= level.thresholds.technology ? 'hài lòng' : 'lo ngại',
    },
  };
}

export function canSelectCard(level: Level, selected: PolicyCardId[], cardId: PolicyCardId) {
  if (!level.hand.includes(cardId)) return false;
  if (selected.includes(cardId)) return true;
  const nextCost = [...selected, cardId].reduce((sum, id) => sum + policyCards[id].cost, 0);
  return selected.length < level.maxCards && nextCost <= level.budget;
}

export function toggleCard(level: Level, selected: PolicyCardId[], cardId: PolicyCardId) {
  if (selected.includes(cardId)) {
    return selected.filter((id) => id !== cardId);
  }

  if (!canSelectCard(level, selected, cardId)) {
    return selected;
  }

  return [...selected, cardId];
}

export function getRequiredText(level: Level) {
  const parts: string[] = [];
  if (level.strategyRoutes?.length) {
    parts.push(
      `Đường lối cộng điểm: ${level.strategyRoutes
        .map((route) => `${route.name} (+${route.bonus})`)
        .join(' / ')}`,
    );
  }
  if (level.requiredAll?.length) {
    parts.push(`Bắt buộc có: ${level.requiredAll.map((id) => policyCards[id].name).join(', ')}`);
  }
  if (level.requiredAny?.length) {
    parts.push(`Cần ít nhất một: ${level.requiredAny.map((id) => policyCards[id].name).join(' hoặc ')}`);
  }
  return parts;
}
