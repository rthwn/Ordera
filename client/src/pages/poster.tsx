import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Blocks,
  Shield,
  Zap,
  Scale,
  Layers,
  ArrowUpDown,
  TrendingUp,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
  Gauge,
  Network,
  Lock,
  Eye,
  Moon,
  Sun,
} from "lucide-react";

const priorityData = [
  { type: "Swap", priority: 0, multiplier: "4x", color: "hsl(217, 91%, 50%)", label: "Highest", desc: "Token exchanges requiring instant execution to prevent front-running and MEV attacks" },
  { type: "Borrow", priority: 1, multiplier: "3x", color: "hsl(262, 83%, 58%)", label: "High", desc: "Time-sensitive liquidity access where delays can mean missed opportunities" },
  { type: "Lend", priority: 2, multiplier: "2x", color: "hsl(174, 60%, 42%)", label: "Medium", desc: "Interest-earning operations that tolerate slight delays without financial loss" },
  { type: "Transfer", priority: 3, multiplier: "1x", color: "hsl(220, 10%, 45%)", label: "Standard", desc: "Peer-to-peer transfers with no time sensitivity or loss risk from delays" },
];

const comparisonData = [
  {
    feature: "Transaction Prioritization",
    ours: "Type-based deterministic priority",
    bitcoin: "Gas fee auction (highest bidder wins)",
    ethereum: "Gas fee + MEV extraction",
    solana: "Fee-based with validator preference",
    polkadot: "No mempool ordering defined",
    oursGood: true,
    bitcoinGood: false,
    ethereumGood: false,
    solanaGood: false,
    polkadotGood: false,
  },
  {
    feature: "Fairness Guarantee",
    ours: "Quota-based anti-starvation slots",
    bitcoin: "None — low-fee txns may wait indefinitely",
    ethereum: "None — frontrunning is common",
    solana: "Low-fee txns may be dropped",
    polkadot: "No explicit fairness mechanism",
    oursGood: true,
    bitcoinGood: false,
    ethereumGood: false,
    solanaGood: false,
    polkadotGood: false,
  },
  {
    feature: "Gas Fee Model",
    ours: "Congestion-aware sigmoid function",
    bitcoin: "Static fee market",
    ethereum: "EIP-1559 base + tip",
    solana: "Low flat fees",
    polkadot: "Weight-based fees",
    oursGood: true,
    bitcoinGood: false,
    ethereumGood: null,
    solanaGood: null,
    polkadotGood: null,
  },
  {
    feature: "DeFi Optimization",
    ours: "Purpose-built for swap/borrow/lend/transfer",
    bitcoin: "Not designed for DeFi",
    ethereum: "General purpose",
    solana: "High throughput but not type-aware",
    polkadot: "Requires custom parachain",
    oursGood: true,
    bitcoinGood: false,
    ethereumGood: null,
    solanaGood: null,
    polkadotGood: false,
  },
  {
    feature: "Implementation Complexity",
    ours: "Lightweight middleware layer",
    bitcoin: "Protocol-level changes needed",
    ethereum: "Protocol-level changes needed",
    solana: "Runtime modifications required",
    polkadot: "Entire parachain deployment",
    oursGood: true,
    bitcoinGood: false,
    ethereumGood: false,
    solanaGood: false,
    polkadotGood: false,
  },
];

const gasTableData = [
  { util: "0%", congestion: "1.18x", swap: "0.00472", borrow: "0.00354", lend: "0.00236", transfer: "0.00118" },
  { util: "25%", congestion: "2.19x", swap: "0.00877", borrow: "0.00658", lend: "0.00438", transfer: "0.00219" },
  { util: "50%", congestion: "6.00x", swap: "0.024", borrow: "0.018", lend: "0.012", transfer: "0.006" },
  { util: "75%", congestion: "9.81x", swap: "0.03923", borrow: "0.02942", lend: "0.01962", transfer: "0.00981" },
  { util: "100%", congestion: "10.82x", swap: "0.04328", borrow: "0.03246", lend: "0.02164", transfer: "0.01082" },
];

const innovationCards = [
  {
    icon: ArrowUpDown,
    title: "Type-Based Priority Ordering",
    description: "Transactions are prioritized by their inherent financial urgency — not by who pays the most gas. Swap > Borrow > Lend > Transfer.",
    accent: "hsl(217, 91%, 50%)",
  },
  {
    icon: Scale,
    title: "Quota-Based Anti-Starvation",
    description: "Reserved block slots guarantee every priority level gets included. Lower-priority transactions never starve, even under heavy load.",
    accent: "hsl(174, 60%, 42%)",
  },
  {
    icon: TrendingUp,
    title: "Sigmoid Gas Fee Model",
    description: "A congestion-aware sigmoid function creates smooth, predictable fee curves. No sudden fee spikes — just gradual, fair adjustments.",
    accent: "hsl(262, 83%, 58%)",
  },
  {
    icon: Layers,
    title: "Priority Gateway Middleware",
    description: "A custom off-chain layer intercepts, classifies, and reorders transactions before they hit the blockchain — zero protocol changes needed.",
    accent: "hsl(38, 92%, 50%)",
  },
  {
    icon: Eye,
    title: "Single-Channel Architecture",
    description: "All transactions flow through one unified channel, enabling global visibility and cross-organizational priority ordering without fragmentation.",
    accent: "hsl(142, 76%, 36%)",
  },
  {
    icon: Shield,
    title: "Anti-Frontrunning by Design",
    description: "Deterministic priority assignment eliminates the ability to manipulate execution order through fee manipulation. Fair sequencing, always.",
    accent: "hsl(0, 84%, 60%)",
  },
];

function StatusIcon({ good }: { good: boolean | null }) {
  if (good === true) return <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />;
  if (good === false) return <XCircle className="w-4 h-4 text-red-400 dark:text-red-400 shrink-0" />;
  return <MinusCircle className="w-4 h-4 text-muted-foreground shrink-0" />;
}

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    const el = document.getElementById(`counter-${end}-${suffix}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [end, suffix, started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return <span id={`counter-${end}-${suffix}`}>{count}{suffix}</span>;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      return stored ? stored === "dark" : true;
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((prev) => !prev) };
}

export default function PosterPage() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [expandedPriority, setExpandedPriority] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="fixed top-4 right-4 z-50">
        <Button
          size="icon"
          variant="outline"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/3" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--muted-foreground) / 0.07) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }} />
        </div>

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge variant="secondary" className="text-xs tracking-widest uppercase px-4 py-1.5 font-mono">
              Hyperledger Fabric + Custom Priority Gateway
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-foreground">Optimised Blockchain for</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              Use-Case Specific
            </span>
            <br />
            <span className="text-foreground">Transaction Prioritization</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A fair, intelligent blockchain network that prioritizes transactions by their financial urgency
            — not by who pays the highest gas fee. Built for DeFi, designed for fairness.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3">
            <a href="#innovations">
              <Button size="lg" data-testid="button-explore">
                Explore Innovations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#comparison">
              <Button size="lg" variant="outline" data-testid="button-compare">
                See Comparison
              </Button>
            </a>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {[
              { label: "Priority Levels", value: 4, suffix: "" },
              { label: "Txns Per Block", value: 5, suffix: "" },
              { label: "Fairness Score", value: 100, suffix: "%" },
              { label: "Front-running", value: 0, suffix: "%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </section>

      <section className="py-8 border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground" data-testid="strip-tech-stack">
            {[
              { icon: Blocks, label: "Hyperledger Fabric 2.5" },
              { icon: Shield, label: "RAFT Consensus" },
              { icon: Zap, label: "Go 1.21+" },
              { icon: Network, label: "CouchDB State" },
              { icon: Lock, label: "TLS Secured" },
              { icon: Gauge, label: "Fabric Gateway SDK" },
            ].map((tech) => (
              <div key={tech.label} className="flex items-center gap-2" data-testid={`text-tech-${tech.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <tech.icon className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4 border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3" data-testid="tags-keywords">
            <Badge variant="outline" className="font-mono text-xs">Capstone Project</Badge>
            <Badge variant="outline" className="font-mono text-xs">Blockchain</Badge>
            <Badge variant="outline" className="font-mono text-xs">DeFi</Badge>
            <Badge variant="outline" className="font-mono text-xs">Transaction Ordering</Badge>
            <Badge variant="outline" className="font-mono text-xs">Hyperledger</Badge>
            <Badge variant="outline" className="font-mono text-xs">Smart Contracts</Badge>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card/30 border-b border-border" data-testid="section-problem">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">The Problem</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Why Existing Blockchains Fall Short</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Gas-Fee Manipulation",
                  desc: "Current networks let wealthy users jump the queue by paying higher fees. Transaction importance is ignored — only wallet size matters.",
                  stat: "Unfair",
                },
                {
                  title: "Transaction Starvation",
                  desc: "Low-fee transactions can wait indefinitely or get dropped entirely. There's no mechanism to guarantee inclusion for all transaction types.",
                  stat: "Unreliable",
                },
                {
                  title: "No Use-Case Awareness",
                  desc: "All transactions are treated identically regardless of their financial urgency. A time-critical swap gets the same treatment as a casual transfer.",
                  stat: "Inefficient",
                },
              ].map((problem) => (
                <motion.div key={problem.title} variants={fadeInUp}>
                  <Card className="p-6 h-full bg-card border-card-border">
                    <div className="text-xs font-mono text-destructive uppercase tracking-wider mb-3">{problem.stat}</div>
                    <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{problem.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="innovations" className="py-20 border-b border-border" data-testid="section-innovations">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Key Innovations</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Makes This Different</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Six core innovations that transform how blockchain networks handle transaction ordering and fairness.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {innovationCards.map((card, idx) => (
                <motion.div key={card.title} variants={fadeInUp}>
                  <Card className="p-6 h-full bg-card border-card-border group" data-testid={`card-innovation-${idx}`}>
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${card.accent}15` }}
                    >
                      <card.icon className="w-5 h-5" style={{ color: card.accent }} />
                    </div>
                    <h3 className="text-base font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-card/30 border-b border-border" data-testid="section-architecture">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Architecture</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Three-Layer System Design</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A hybrid architecture where intelligent ordering happens off-chain, while consensus and ledger management stay on-chain.
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  layer: "01",
                  name: "Client Layer",
                  subtitle: "Transaction Submission",
                  description: "DApps submit transactions with embedded type metadata (swap, borrow, lend, transfer). The priority is deterministically derived from the type — users cannot manipulate it.",
                  color: "hsl(217, 91%, 50%)",
                  tags: ["DApps", "Transaction Types", "Priority Assignment"],
                },
                {
                  layer: "02",
                  name: "Priority Gateway",
                  subtitle: "Off-Chain Ordering Engine",
                  description: "Custom middleware intercepts transactions, manages a priority-aware mempool with min-heap ordering, and uses alternating quota-based + FIFO batching to form optimally ordered blocks.",
                  color: "hsl(174, 60%, 42%)",
                  tags: ["Mempool", "Priority Queue", "Batcher", "Anti-Starvation"],
                },
                {
                  layer: "03",
                  name: "Blockchain Layer",
                  subtitle: "Hyperledger Fabric Network",
                  description: "Pre-ordered blocks enter RAFT consensus for validation. Smart contracts execute wallet operations, balance updates, and gas fee computation. CouchDB stores the immutable state.",
                  color: "hsl(262, 83%, 58%)",
                  tags: ["RAFT Consensus", "Smart Contracts", "CouchDB", "Ledger"],
                },
              ].map((layer, i) => (
                <motion.div key={layer.layer} variants={fadeInUp}>
                  <Card className="p-6 bg-card border-card-border">
                    <div className="flex flex-col sm:flex-row gap-4" data-testid={`card-layer-${layer.layer}`}>
                      <div className="shrink-0">
                        <div
                          className="w-12 h-12 rounded-md flex items-center justify-center font-mono text-lg font-bold"
                          style={{ backgroundColor: `${layer.color}15`, color: layer.color }}
                        >
                          {layer.layer}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{layer.name}</h3>
                          <span className="text-xs text-muted-foreground font-mono">{layer.subtitle}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{layer.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {layer.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] font-mono">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {i < 2 && (
                      <div className="flex justify-center mt-4">
                        <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-b border-border" data-testid="section-priority">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Priority Model</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Deterministic Priority Assignment</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Each transaction type maps to a fixed priority level. No bidding, no manipulation — just logic-driven ordering.
              </p>
            </motion.div>

            <div className="space-y-3">
              {priorityData.map((item) => (
                <motion.div key={item.type} variants={fadeInUp}>
                  <Card
                    className="bg-card border-card-border cursor-pointer"
                    onClick={() => setExpandedPriority(expandedPriority === item.priority ? null : item.priority)}
                    data-testid={`card-priority-${item.type.toLowerCase()}`}
                  >
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-md flex items-center justify-center font-mono text-sm font-bold shrink-0"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          P{item.priority}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-base" data-testid={`text-priority-type-${item.type.toLowerCase()}`}>{item.type}</span>
                            <Badge variant="secondary" className="text-[10px] font-mono">{item.label}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs text-muted-foreground font-mono">Gas Multiplier</span>
                            <div className="font-mono font-bold" style={{ color: item.color }}>{item.multiplier}</div>
                          </div>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${100 - item.priority * 25}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expandedPriority === item.priority ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedPriority === item.priority && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0 border-t border-card-border">
                            <p className="text-sm text-muted-foreground pt-4 leading-relaxed">{item.desc}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-card/30 border-b border-border" data-testid="section-gas-fee">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Gas Fee Model</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Congestion-Aware Dynamic Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A sigmoid function creates smooth, predictable fee curves that self-regulate network load through price discovery.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-10">
              <Card className="p-6 bg-card border-card-border">
                <div className="text-center font-mono text-sm sm:text-base">
                  <div className="text-muted-foreground mb-2">Formula</div>
                  <div className="text-foreground font-semibold text-base sm:text-lg">
                    Gas Fee = Base Fee <span className="text-primary">x</span> Priority Multiplier <span className="text-primary">x</span> Congestion Factor
                  </div>
                  <div className="text-xs text-muted-foreground mt-3 max-w-lg mx-auto">
                    where Congestion Factor = 1 + (MaxSurge / (1 + e<sup>-k(u - 0.5)</sup>)), u = utilization, MaxSurge = 10.0, k = 8.0
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-card border-card-border overflow-x-auto">
                <div className="min-w-[600px]">
                  <table className="w-full text-sm" data-testid="table-gas-fees">
                    <thead>
                      <tr className="border-b border-card-border">
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Utilization</th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Congestion</th>
                        <th className="text-right px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: priorityData[0].color }}>Swap (P0)</th>
                        <th className="text-right px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: priorityData[1].color }}>Borrow (P1)</th>
                        <th className="text-right px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: priorityData[2].color }}>Lend (P2)</th>
                        <th className="text-right px-4 py-3 font-mono text-xs uppercase tracking-wider" style={{ color: priorityData[3].color }}>Transfer (P3)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gasTableData.map((row, i) => (
                        <tr key={row.util} className={i < gasTableData.length - 1 ? "border-b border-card-border" : ""}>
                          <td className="px-4 py-3 font-mono font-semibold">{row.util}</td>
                          <td className="px-4 py-3 font-mono text-primary">{row.congestion}</td>
                          <td className="text-right px-4 py-3 font-mono text-xs">{row.swap}</td>
                          <td className="text-right px-4 py-3 font-mono text-xs">{row.borrow}</td>
                          <td className="text-right px-4 py-3 font-mono text-xs">{row.lend}</td>
                          <td className="text-right px-4 py-3 font-mono text-xs">{row.transfer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { title: "Gentle at Low Load", desc: "Fees barely increase until 25% utilization, encouraging organic network usage.", color: "hsl(142, 76%, 36%)" },
                { title: "Steep at Medium Load", desc: "Strong economic signals between 40-60% create natural self-regulation.", color: "hsl(38, 92%, 50%)" },
                { title: "Capped at High Load", desc: "Natural fee ceiling above 75% prevents excessive costs even at peak usage.", color: "hsl(0, 84%, 60%)" },
              ].map((info) => (
                <Card key={info.title} className="p-5 bg-card border-card-border">
                  <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: info.color }} />
                  <h4 className="text-sm font-semibold mb-1">{info.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-b border-border" data-testid="section-batching">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Batching Strategy</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Smart Block Formation</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Alternating between pure priority ordering and quota-based fairness to balance throughput with inclusion guarantees.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <motion.div variants={fadeInUp}>
                <Card className="p-6 bg-card border-card-border h-full">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">Priority-First Block</h3>
                    <Badge variant="secondary" className="text-[10px] font-mono">Odd Blocks</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Transactions sorted strictly by ascending priority within the window. Highest urgency executes first.</p>
                  <div className="font-mono text-xs space-y-1.5">
                    <div className="text-muted-foreground">Mempool: [0, 0, 0, 1, 1, 2, 3, 0, 0]</div>
                    <ArrowRight className="w-3 h-3 text-primary mx-auto" />
                    <div className="flex gap-1.5">
                      {[0, 0, 0, 0, 1].map((p, i) => (
                        <div
                          key={i}
                          className="flex-1 h-8 rounded-md flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: `${priorityData[p].color}20`, color: priorityData[p].color }}
                        >
                          P{p}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-6 bg-card border-card-border h-full">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                      <Scale className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="font-semibold">Quota-Fair Block</h3>
                    <Badge variant="secondary" className="text-[10px] font-mono">Even Blocks</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">At least one slot reserved per available priority level. Prevents starvation of lower-priority types.</p>
                  <div className="font-mono text-xs space-y-1.5">
                    <div className="text-muted-foreground">Mempool: [0, 0, 0, 0, 0, 1, 1, 2, 3]</div>
                    <ArrowRight className="w-3 h-3 text-accent mx-auto" />
                    <div className="flex gap-1.5">
                      {[0, 0, 1, 2, 3].map((p, i) => (
                        <div
                          key={i}
                          className="flex-1 h-8 rounded-md flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: `${priorityData[p].color}20`, color: priorityData[p].color }}
                        >
                          P{p}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="mt-6">
              <Card className="p-5 bg-card border-card-border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4" data-testid="card-dual-trigger">
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-md bg-chart-3/10 flex items-center justify-center">
                      <Gauge className="w-4 h-4 text-chart-3" />
                    </div>
                    <span className="font-semibold text-sm">Dual Trigger</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Blocks form when <span className="font-mono text-foreground">count threshold (5 txns)</span> or <span className="font-mono text-foreground">time epoch (3 seconds)</span> is reached — whichever comes first. This ensures consistent throughput under both high and low load conditions.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="comparison" className="py-20 bg-card/30 border-b border-border" data-testid="section-comparison">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Competitive Analysis</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How We Compare</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A head-to-head comparison with the leading blockchain networks across critical DeFi parameters.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-card border-card-border overflow-x-auto">
                <div className="min-w-[900px]">
                  <table className="w-full text-sm" data-testid="table-comparison">
                    <thead>
                      <tr className="border-b border-card-border">
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider w-44">Feature</th>
                        <th className="text-left px-4 py-3 text-xs uppercase tracking-wider w-48">
                          <span className="font-bold text-primary">Our Project</span>
                        </th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Bitcoin</th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Ethereum</th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Solana</th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">Polkadot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, i) => (
                        <tr key={row.feature} className={i < comparisonData.length - 1 ? "border-b border-card-border" : ""}>
                          <td className="px-4 py-3 font-semibold text-xs">{row.feature}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <StatusIcon good={row.oursGood} />
                              <span className="text-xs text-foreground font-medium">{row.ours}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <StatusIcon good={row.bitcoinGood} />
                              <span className="text-xs text-muted-foreground">{row.bitcoin}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <StatusIcon good={row.ethereumGood} />
                              <span className="text-xs text-muted-foreground">{row.ethereum}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <StatusIcon good={row.solanaGood} />
                              <span className="text-xs text-muted-foreground">{row.solana}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <StatusIcon good={row.polkadotGood} />
                              <span className="text-xs text-muted-foreground">{row.polkadot}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[
                { network: "vs Bitcoin", gap: "No DeFi awareness, no priority ordering, no fairness mechanism. Purely fee-auction based.", color: "hsl(38, 92%, 50%)" },
                { network: "vs Ethereum", gap: "Susceptible to MEV/frontrunning, gas wars inflate costs, no guaranteed inclusion for low-fee txns.", color: "hsl(262, 83%, 58%)" },
                { network: "vs Solana", gap: "Speed-first approach may drop low-fee transactions. No configurable use-case specific prioritization.", color: "hsl(174, 60%, 42%)" },
                { network: "vs Polkadot", gap: "Requires deploying an entire parachain for custom ordering. No built-in mempool prioritization logic.", color: "hsl(217, 91%, 50%)" },
              ].map((item) => (
                <Card key={item.network} className="p-5 bg-card border-card-border">
                  <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: item.color }} />
                  <h4 className="text-sm font-semibold mb-2">{item.network}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.gap}</p>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-b border-border" data-testid="section-results">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Validation</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Proven Results</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Testing with 30+ transactions across all priority levels demonstrates consistent, fair ordering and reliable block formation.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { value: "25", label: "Transactions Committed", sub: "out of 30 submitted" },
                { value: "5", label: "Blocks Formed", sub: "5 txns per block" },
                { value: "100%", label: "Ordering Accuracy", sub: "priority respected" },
                { value: "0", label: "Starvation Events", sub: "all types included" },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeInUp}>
                  <Card className="p-5 bg-card border-card-border text-center" data-testid={`stat-result-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="text-3xl font-bold font-mono text-primary mb-1">{stat.value}</div>
                    <div className="text-sm font-semibold mb-0.5">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.sub}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 bg-card border-card-border">
                <h3 className="font-semibold mb-4">Sample Block Visualization</h3>
                <div className="space-y-3">
                  {[
                    { block: 1, txns: [
                      { id: "TX-01", type: "swap", p: 0 },
                      { id: "TX-05", type: "swap", p: 0 },
                      { id: "TX-03", type: "borrow", p: 1 },
                      { id: "TX-07", type: "lend", p: 2 },
                      { id: "TX-02", type: "transfer", p: 3 },
                    ]},
                    { block: 2, txns: [
                      { id: "TX-09", type: "swap", p: 0 },
                      { id: "TX-11", type: "swap", p: 0 },
                      { id: "TX-08", type: "borrow", p: 1 },
                      { id: "TX-10", type: "borrow", p: 1 },
                      { id: "TX-06", type: "lend", p: 2 },
                    ]},
                    { block: 3, txns: [
                      { id: "TX-14", type: "swap", p: 0 },
                      { id: "TX-12", type: "borrow", p: 1 },
                      { id: "TX-15", type: "lend", p: 2 },
                      { id: "TX-13", type: "lend", p: 2 },
                      { id: "TX-04", type: "transfer", p: 3 },
                    ]},
                  ].map((block) => (
                    <div key={block.block} className="flex items-center gap-3">
                      <div className="w-20 shrink-0 text-right">
                        <span className="font-mono text-xs text-muted-foreground">Block {block.block}</span>
                      </div>
                      <div className="flex gap-1.5 flex-1">
                        {block.txns.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex-1 py-2 rounded-md text-center text-[10px] font-mono font-bold"
                            style={{ backgroundColor: `${priorityData[tx.p].color}15`, color: priorityData[tx.p].color }}
                            title={`${tx.id} - ${tx.type}`}
                          >
                            <div>{tx.id}</div>
                            <div className="text-[9px] opacity-70">{tx.type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-card-border" data-testid="legend-priority-colors">
                  {priorityData.map((p) => (
                    <div key={p.type} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${p.color}30` }} />
                      <span className="text-[10px] font-mono text-muted-foreground">{p.type} (P{p.priority})</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-card/30 border-b border-border" data-testid="section-tech">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Technology</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built With Enterprise-Grade Tools</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { category: "Languages", items: ["Go 1.21+", "Golang Chaincode"] },
                { category: "Framework", items: ["Hyperledger Fabric 2.5", "Fabric Gateway SDK", "Contract API"] },
                { category: "Infrastructure", items: ["Docker Compose", "CouchDB", "React.js Dashboard"] },
                { category: "Tooling", items: ["fabric-samples", "peer CLI", "Go modules", "Git"] },
              ].map((group) => (
                <motion.div key={group.category} variants={fadeInUp}>
                  <Card className="p-5 bg-card border-card-border h-full">
                    <h4 className="text-xs uppercase tracking-wider text-primary font-mono mb-3">{group.category}</h4>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24" data-testid="section-footer">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-4">Summary</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Fairer Blockchains Start With
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
                  Smarter Ordering
                </span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
                This project proves that transaction prioritization can be intelligent, fair, and practical
                — without requiring protocol-level changes or sacrificing decentralization principles.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3" data-testid="tags-summary">
              {[
                "Deterministic Priority",
                "Anti-Starvation",
                "Sigmoid Gas Fees",
                "Off-Chain Ordering",
                "RAFT Consensus",
                "DeFi Optimized",
              ].map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-mono px-3 py-1">{tag}</Badge>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground font-mono">
                Ordera &mdash; Optimised Blockchain Network for Use-Case Specific Transaction Prioritization
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Capstone Project &middot; Hyperledger Fabric &middot; 2025
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
