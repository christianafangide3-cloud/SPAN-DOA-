import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as d3 from "d3";

export default function MapPage() {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    const [nodesCount, setNodesCount] = useState(0);
    const [allExpanded, setAllExpanded] = useState(false);
    const [tooltipText, setTooltipText] = useState("");
    const [tooltipStyle, setTooltipStyle] = useState({ opacity: 0, left: 0, top: 0 });

    const STAGE_COLORS = [
        "#f59e0b", // Stage 1 – Amber
        "#10b981", // Stage 2 – Emerald
        "#0284c7", // Stage 3 – Cyan
        "#8b5cf6", // Stage 4 – Violet
        "#f43f5e", // Stage 5 – Rose
        "#ea580c"  // Stage 6 – Orange
    ];

    const GENES = ["FGF8","PITX2","SHH","WNT","SRY","TBX4","BMP4","NT-3","GnRH","FSH","LH"];
    const CLINICAL_KW = ["[CLINICAL TRAP]","TERATOLOGY","[TERATOLOGY"];

    const treeData = {
        name: "ANA 213: EMBRYOLOGY",
        children: [
            {
                name: "STAGE 1: THE FOUNDATION",
                children: [
                    { name: "[CLINICAL TRAP] Aneuploidies & Microdeletions" },
                    { name: "Gametogenesis", children: [
                        { name: "Male: Spermatogenesis (74 Days to Spermatozoa)" },
                        { name: "Female: Oogenesis (Meiosis I Arrest at Dictyotene)" }
                    ]},
                    { name: "Reproductive Cycles", children: [
                        { name: "Ovarian Cycle: GnRH → FSH/LH → Ovulation" },
                        { name: "Menstrual Cycle: Estrogen/Progesterone phases" }
                    ]}
                ]
            },
            {
                name: "STAGE 2: WEEKS 1 & 2",
                children: [
                    { name: "Day 1: Fertilization (Ampulla)", children: [
                        { name: "Capacitation & Acrosome Reaction" },
                        { name: "Cortical Reaction (Polyspermy block)" }
                    ]},
                    { name: "Days 2-5: Cleavage", children: [
                        { name: "Zygote (2n, 46) forms" },
                        { name: "Morula (16-cell compacted ball)" },
                        { name: "Blastocyst (Enters uterine cavity)" }
                    ]},
                    { name: "Week 2: Implantation (Week of Twos)", children: [
                        { name: "Trophoblast → Cyto & Syncytiotrophoblast (secretes hCG)" },
                        { name: "Embryoblast → Epiblast & Hypoblast (Bilaminar Disc)" },
                        { name: "Cavities: Amniotic Cavity & Yolk Sac" }
                    ]}
                ]
            },
            {
                name: "STAGE 3: THE THIRD WEEK",
                children: [
                    { name: "Gastrulation (Most Critical Week)", children: [
                        { name: "Primitive Streak forms on Epiblast" },
                        { name: "FGF8 triggers migration, downregulates E-cadherin" },
                        { name: "TRILAMINAR DISC: Ectoderm, Mesoderm, Endoderm" }
                    ]},
                    { name: "Notochordogenesis (Forms axial skeleton template)" },
                    { name: "Body Axes Established (PITX2 gene – Left-Right sidedness)" }
                ]
            },
            {
                name: "STAGE 4: WEEKS 3-8 (ORGANOGENESIS)",
                children: [
                    { name: "Branch A: ECTODERM (Skin & Nerves)", children: [
                        { name: "BMP4 Inhibition (via Chordin/Noggin → neural tissue)" },
                        { name: "Neurulation: Neural Plate → Neural Tube (Closes Day 25/28)" },
                        { name: "Neural Crest (4th Germ Layer) → DRGs, Melanocytes, Adrenal Medulla" }
                    ]},
                    { name: "Branch B: MESODERM (Muscle, Bone, Blood, Kidney)", children: [
                        { name: "Paraxial: Somites (SHH→Sclerotome, WNT→Myotome, NT-3→Dermatome)" },
                        { name: "Intermediate: Nephrogenic Cord (Kidneys & Gonads)" },
                        { name: "Lateral Plate: Somatic (Body Wall) & Splanchnic (Gut Muscle)" }
                    ]},
                    { name: "Branch C: ENDODERM (Linings & Glands)", children: [
                        { name: "Embryonic Folding: Cephalocaudal & Lateral" },
                        { name: "Primitive Gut Tube formed by pinching off Yolk Sac" }
                    ]}
                ]
            },
            {
                name: "STAGE 5: SYSTEMIC SPECIALIZATION",
                children: [
                    { name: "The Gut Tube", children: [
                        { name: "Foregut: Stomach (90° rotation), Liver, Pancreas" },
                        { name: "Midgut: Herniates → 270° counterclockwise rotation" },
                        { name: "Hindgut: Cloaca (partitioned by Urorectal Septum)" }
                    ]},
                    { name: "Pharyngeal Apparatus", children: [
                        { name: "Arches: 1(Malleus/Incus), 2(Stapes), 3/4/6(Laryngeal cartilages)" },
                        { name: "Pouches: 3(Inf. Parathyroid/Thymus), 4(Sup. Parathyroid)" },
                        { name: "Lung Buds (TBX4 gene) & Tracheoesophageal Septum" }
                    ]},
                    { name: "Cardiovascular System", children: [
                        { name: "Heart Tube: Loops RIGHT under PITX2 influence" },
                        { name: "Septation: Atrial (Foramen Ovale), Ventricular, Outflow Tract" },
                        { name: "Fetal Shunts: Ductus Venosus, Foramen Ovale, Ductus Arteriosus" }
                    ]},
                    { name: "Urogenital System", children: [
                        { name: "Renal: Pronephros → Mesonephros → Metanephros" },
                        { name: "Gonadal: SRY Gene → Testes (Wolffian) vs Ovaries (Müllerian)" }
                    ]}
                ]
            },
            {
                name: "STAGE 6: FETAL PERIOD & CLINICS",
                children: [
                    { name: "Placentation & Fluids", children: [
                        { name: "Placental Barrier thins for diffusion" },
                        { name: "[CLINICAL TRAP] Polyhydramnios vs Oligohydramnios" }
                    ]},
                    { name: "Twinning Genetics", children: [
                        { name: "Dizygotic (Always DiDi)" },
                        { name: "Monozygotic: splitting time → DiDi, MoDi, MoMo, Conjoined" }
                    ]},
                    { name: "[TERATOLOGY WARNING]", children: [
                        { name: "Thalidomide (Limb defects)" },
                        { name: "Fetal Alcohol Syndrome (FAS)" },
                        { name: "TORCH Infections (Toxo, Rubella, CMV, Herpes)" }
                    ]}
                ]
            }
        ]
    };

    const isClinical = (name) => CLINICAL_KW.some(k => name.includes(k));
    const isGene = (name) => GENES.some(g => name.includes(g));

    const nodeColor = (d) => {
        if (d.depth === 0) return "#0ea5e9"; 
        if (d.depth === 1) return STAGE_COLORS[d.data._si % STAGE_COLORS.length];
        return d._children ? "#a78bfa" : "#ffffff"; 
    };

    const nodeStroke = (d) => {
        if (d.depth === 0) return "#0284c7";
        if (d.depth === 1) return STAGE_COLORS[d.data._si % STAGE_COLORS.length];
        return d._children ? "#6d28d9" : "#cbd5e1";
    };

    const textColor = (d) => {
        if (isClinical(d.data.name)) return "#f43f5e"; // Rose
        if (isGene(d.data.name))     return "#fbbf24"; // Amber
        return "#f8fafc"; // White
    };

    const d3ZoomRef = useRef(null);
    const d3RootRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        const W = containerRef.current.clientWidth;
        const H = containerRef.current.clientHeight;

        d3.select(svgRef.current).selectAll("g").remove();

        const zoomBeh = d3.zoom().scaleExtent([0.25, 4]).on("zoom", (e) => {
            d3.select(svgRef.current).select("g.viewport").attr("transform", e.transform);
        });

        d3ZoomRef.current = zoomBeh;

        const svg = d3.select(svgRef.current)
            .attr("width", "100%")
            .attr("height", "100%")
            .call(zoomBeh)
            .on("dblclick.zoom", null);

        const g = svg.append("g").attr("class", "viewport");

        // Initial Translate View
        svg.call(zoomBeh.transform, d3.zoomIdentity.translate(64, H / 2.25).scale(0.85));

        const treeLayout = d3.tree().nodeSize([42, 280]);

        const root = d3.hierarchy(treeData);
        root.x0 = 0;
        root.y0 = 0;

        root.children && root.children.forEach((stage, i) => {
            const sc = STAGE_COLORS[i % STAGE_COLORS.length];
            stage.descendants().forEach(d => { d.data._si = i; d.data._sc = sc; });
            stage.data._si = i; stage.data._sc = sc;
        });

        root.descendants().forEach((d, i) => {
            d.id = i;
            if (d.depth > 0) { d._children = d.children; d.children = null; }
        });

        d3RootRef.current = root;

        const diagonal = ({source, target}) => {
            const mx = (source.y + target.y) / 2;
            return `M${target.y},${target.x}C${mx},${target.x} ${mx},${source.x} ${source.y},${source.x}`;
        };

        const update = (source) => {
            treeLayout(root);
            const nodes = root.descendants();
            const links  = root.links();
            const t = d3.transition().duration(400);

            // LINKS
            const link = g.selectAll("path.link").data(links, d => d.target.id);

            const linkEnter = link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke-width", "1.5px")
                .attr("d", () => { const o={x:source.x0,y:source.y0}; return diagonal({source:o,target:o}); })
                .attr("stroke", d => d.target.data._sc || "#94a3b8")
                .attr("opacity", 0);

            link.merge(linkEnter).transition(t)
                .attr("d", diagonal)
                .attr("stroke", d => d.target.data._sc || "#94a3b8")
                .attr("opacity", d => d.target.depth === 1 ? 0.7 : 0.4);

            link.exit().transition(t)
                .attr("d", () => { const o={x:source.x,y:source.y}; return diagonal({source:o,target:o}); })
                .attr("opacity", 0).remove();

            // NODES
            const node = g.selectAll("g.node").data(nodes, d => d.id);

            const nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("cursor", "pointer")
                .attr("transform", `translate(${source.y0},${source.x0})`)
                .on("click", (ev, d) => {
                    ev.stopPropagation();
                    if (d.children) { d._children=d.children; d.children=null; }
                    else             { d.children=d._children; d._children=null; }
                    setAllExpanded(false);
                    update(d);
                })
                .on("mouseover", (ev, d) => {
                    setTooltipText(d.data.name);
                    const isClin = isClinical(d.data.name);
                    const isG = isGene(d.data.name);
                    const borderC = isClin ? "border-rose-500" : isG ? "border-amber-400" : "border-slate-800";
                    const textC = isClin ? "text-rose-400" : isG ? "text-amber-400" : "text-white";

                    setTooltipStyle({
                        opacity: 1,
                        left: Math.min(ev.clientX + 16, window.innerWidth - 310),
                        top: Math.max(ev.clientY - 12, 72),
                        borderC,
                        textC
                    });
                })
                .on("mousemove", (ev) => {
                    setTooltipStyle(prev => ({
                        ...prev,
                        left: Math.min(ev.clientX + 16, window.innerWidth - 310),
                        top: Math.max(ev.clientY - 12, 72)
                    }));
                })
                .on("mouseout", () => {
                    setTooltipStyle(prev => ({ ...prev, opacity: 0 }));
                });

            nodeEnter.append("circle")
                .attr("class", "pulse-ring")
                .attr("r", 1e-6)
                .attr("fill", "none")
                .attr("stroke-width", 1.5)
                .attr("stroke", d => nodeColor(d));

            nodeEnter.append("circle")
                .attr("class", "main-c")
                .attr("r", 1e-6)
                .attr("fill", d => nodeColor(d))
                .attr("stroke", d => nodeStroke(d))
                .attr("stroke-width", 2);

            nodeEnter.append("text")
                .attr("class", "lbl")
                .attr("dy", "0.32em")
                .attr("x", d => (d._children||d.children) ? -16 : 16)
                .attr("text-anchor", d => (d._children||d.children) ? "end" : "start")
                .text(d => d.data.name.length > 52 ? d.data.name.slice(0, 51) + "…" : d.data.name)
                .attr("fill", d => textColor(d))
                .attr("font-size", "11px")
                .attr("font-weight", "600")
                .attr("fill-opacity", 1e-6);

            const nodeUp = node.merge(nodeEnter).transition(t)
                .attr("transform", d => `translate(${d.y},${d.x})`);

            nodeUp.select("circle.main-c")
                .attr("r", d => d.depth === 0 ? 11 : d.depth === 1 ? 8 : 6)
                .attr("fill", d => nodeColor(d))
                .attr("stroke", d => nodeStroke(d));

            nodeUp.select("circle.pulse-ring")
                .attr("r", d => (d._children && d.depth > 0) ? (d.depth === 0 ? 11 : d.depth === 1 ? 8 : 6) + 5 : 0)
                .attr("stroke", d => nodeColor(d));

            nodeUp.select("text.lbl")
                .attr("fill-opacity", 1)
                .attr("x", d => (d._children||d.children) ? -16 : 16)
                .attr("text-anchor", d => (d._children||d.children) ? "end" : "start")
                .attr("fill", d => textColor(d));

            const nodeExit = node.exit().transition(t)
                .attr("transform", `translate(${source.y},${source.x})`).remove();
            nodeExit.select("circle.main-c").attr("r", 1e-6);
            nodeExit.select("circle.pulse-ring").attr("r", 0);
            nodeExit.select("text.lbl").attr("fill-opacity", 1e-6);

            nodes.forEach(d => { d.x0=d.x; d.y0=d.y; });
            
            const visibleN = root.descendants().filter(d => !d.parent || (d.parent.children && d.parent.children.includes(d))).length;
            setNodesCount(visibleN);
        };

        update(root);
        window._reactD3Update = update;

        const handleResize = () => {
            const newW = containerRef.current.clientWidth;
            const newH = containerRef.current.clientHeight;
            d3.select(svgRef.current).attr("width", newW).attr("height", newH);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);

    }, []);

    const handleZoomIn = () => {
        d3.select(svgRef.current).transition().duration(280).call(d3ZoomRef.current.scaleBy, 1.4);
    };

    const handleZoomOut = () => {
        d3.select(svgRef.current).transition().duration(280).call(d3ZoomRef.current.scaleBy, 0.72);
    };

    const handleResetZoom = () => {
        const H = containerRef.current.clientHeight;
        d3.select(svgRef.current).transition().duration(700)
            .call(d3ZoomRef.current.transform, d3.zoomIdentity.translate(64, H / 2.25).scale(0.85));
    };

    const handleToggleAll = () => {
        const nextState = !allExpanded;
        setAllExpanded(nextState);

        d3RootRef.current.descendants().forEach(d => {
            if (nextState) {
                if (d._children) { d.children = d._children; d._children = null; }
            } else {
                if (d.depth > 0 && d.children) { d._children = d.children; d.children = null; }
            }
        });
        window._reactD3Update(d3RootRef.current);
    };

    return (
        <div ref={containerRef} className="fixed inset-0 pt-16 overflow-hidden select-none bg-[#030712]">
            {/* Top Navigation */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg">
                        <i className="fas fa-dna"></i>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white font-head leading-tight">ANA 213 Map</h1>
                        <p className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase mt-0.5">Embryology Core Array</p>
                    </div>
                </div>
                <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:text-rose-400 hover:border-rose-400/30 transition-all">
                    <i className="fas fa-times text-sm"></i>
                </Link>
            </div>

            {/* Tree Canvas */}
            <svg ref={svgRef} className="w-full h-full relative z-10"></svg>
            
            {/* Dot Grid and flares */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-25" style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "36px 36px"
            }}></div>
            <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5"></div>

            {/* Tooltip */}
            <div 
                className={`fixed z-50 p-2.5 bg-slate-900 border rounded-xl text-xs font-semibold max-w-[280px] pointer-events-none transition-opacity duration-150 shadow-2xl ${
                    tooltipStyle.borderC || "border-white/5"
                } ${tooltipStyle.textC || "text-white"}`}
                style={{
                    opacity: tooltipStyle.opacity,
                    left: `${tooltipStyle.left}px`,
                    top: `${tooltipStyle.top}px`
                }}
            >
                {tooltipText}
            </div>

            {/* Legend overlay */}
            <div className="fixed top-20 left-4 z-20 bg-slate-950/70 border border-white/5 p-3.5 rounded-2xl backdrop-blur-md space-y-2 max-w-[160px] text-[10px] hidden sm:block">
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">Legend</div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div><span className="text-slate-300">Root node</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div><span className="text-slate-300">Stage nodes</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#a78bfa]"></div><span className="text-slate-300">Expandable</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-500"></div><span className="text-slate-300">Terminal</span></div>
                <div className="border-t border-white/5 pt-1.5 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div><span className="text-rose-400 font-bold">Clinical Trap</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><span className="text-amber-500 font-bold">Gene Marker</span></div>
            </div>

            {/* Node visible counter */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 bg-slate-950/70 border border-white/5 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-slate-400 backdrop-blur-md">
                <b className="text-cyan-400 font-extrabold">{nodesCount}</b> NODES VISIBLE
            </div>

            {/* Expand / Collapse All */}
            <button 
                onClick={handleToggleAll}
                className="fixed top-20 right-4 z-20 bg-slate-950/70 border border-purple-500/30 hover:border-purple-500/50 px-4 py-2.5 rounded-xl font-mono text-[10px] tracking-wider uppercase text-purple-300 flex items-center gap-2 backdrop-blur-md"
            >
                <i className={`fas ${allExpanded ? "fa-compress-alt" : "fa-expand-alt"}`}></i>
                {allExpanded ? "Collapse All" : "Expand All"}
            </button>

            {/* Controls */}
            <div className="fixed bottom-6 right-4 z-20 flex flex-col gap-2">
                <button onClick={handleZoomIn} className="w-10 h-10 rounded-xl bg-slate-950/70 border border-white/5 text-slate-400 hover:text-cyan-400 flex items-center justify-center backdrop-blur-md"><i className="fas fa-plus"></i></button>
                <button onClick={handleResetZoom} className="w-10 h-10 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-center backdrop-blur-md"><i className="fas fa-crosshairs"></i></button>
                <button onClick={handleZoomOut} className="w-10 h-10 rounded-xl bg-slate-950/70 border border-white/5 text-slate-400 hover:text-cyan-400 flex items-center justify-center backdrop-blur-md"><i className="fas fa-minus"></i></button>
            </div>

        </div>
    );
}
