import { NextRequest, NextResponse } from "next/server";
import type { Complaint, ComplaintEvent, Incident, Overview, User } from "@/lib/types";

// In-memory data store for serverless execution
let users: User[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "citizen@jansutra.in",
    role: "citizen",
    preferred_language: "hi",
    ward: "Ward 12",
  },
  {
    id: 2,
    name: "Meera Verma",
    email: "officer@jansutra.in",
    role: "officer",
    preferred_language: "en",
    ward: "Ward 12",
  },
  {
    id: 3,
    name: "Dr. Ananya Joshi",
    email: "admin@jansutra.in",
    role: "admin",
    preferred_language: "en",
    ward: "BMC Central",
  },
];

let incidents: Incident[] = [
  {
    id: 1,
    incident_code: "INC-WATER-001",
    title: "Chronic Main Pipeline Depressurization & Pavement Leakage",
    category: "Water Supply",
    department: "Water Supply Department",
    ward: "Ward 12",
    priority: "P1",
    status: "open",
    linked_complaints: 18,
    summary: "Master incident fused from 18 citizen reports in Arera Colony E-Sector. Main feeder pipe cracked.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    incident_code: "INC-ELEC-002",
    title: "Streetlight Feeder Loop Outage at Main Crossing",
    category: "Street Lighting",
    department: "Electrical & Street Lighting",
    ward: "Ward 12",
    priority: "P2",
    status: "open",
    linked_complaints: 5,
    summary: "Transformer feeder breaker trip affecting 5 lamps along 10 No. Market crossing.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    incident_code: "INC-DRAIN-003",
    title: "Outfall Canal Silt Blockage & Monsoon Backflow Risk",
    category: "Drainage & Sewerage",
    department: "Drainage Department",
    ward: "Ward 10",
    priority: "P1",
    status: "open",
    linked_complaints: 14,
    summary: "Choked storm outfall canal near MP Nagar Zone 2 causing localized surface flooding.",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let complaints: (Complaint & { events: ComplaintEvent[] })[] = [
  {
    id: 1,
    complaint_code: "JS-261102-A891BC",
    incident_id: 1,
    title: "Water Supply: E-7/42 Arera Colony",
    description:
      "Hamare area Ward 12 Arera Colony E-Sector me kal se main water supply line se tezi se paani beh raha hai aur gali me paani bhar gaya hai.",
    original_language: "hinglish",
    category: "Water Supply",
    department: "Water Supply Department",
    ward: "Ward 12",
    address: "E-7/42 Arera Colony, near community park",
    priority: "P1",
    status: "resolved",
    confidence: 0.98,
    routing_reason: "High pressure pipeline failure matching master incident #INC-WATER-001",
    citizen_verification: "pending",
    resolution_note:
      "Field engineering crew replaced 4-meter ductile iron collar section and reinforced bitumen pavement seal. Pressure restored to 3.8 bar.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    citizen_name: "Aarav Sharma",
    events: [
      {
        event_type: "submitted",
        note: "Received via BhashaBridge conversational audio triage",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        event_type: "acknowledged",
        note: "Assigned to Er. Rakesh Sharma, Joint Municipal Commissioner",
        created_at: new Date(Date.now() - 86400000 * 1.8).toISOString(),
      },
      {
        event_type: "in_progress",
        note: "Work order #WO-891 issued to PHE Water Grid Contractor",
        created_at: new Date(Date.now() - 86400000 * 1.2).toISOString(),
      },
      {
        event_type: "resolved",
        note: "Collar repaired and photographic proof submitted to Sovereign ledger",
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
  },
  {
    id: 2,
    complaint_code: "JS-261102-B902CD",
    incident_id: 2,
    title: "Street Lighting: Crossroad 4, 10 No. Market",
    description: "Pichle tin din se crossroad ki light band hai aur andhera rehta hai raat me.",
    original_language: "hinglish",
    category: "Street Lighting",
    department: "Electrical & Street Lighting",
    ward: "Ward 12",
    address: "Crossroad 4, 10 No. Market, Arera Colony",
    priority: "P2",
    status: "in_progress",
    confidence: 0.94,
    routing_reason: "Feeder breaker trip reported across 3 poles",
    citizen_verification: "none",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    citizen_name: "Anita Verma",
    events: [
      {
        event_type: "submitted",
        note: "Logged by citizen via mobile portal",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        event_type: "acknowledged",
        note: "Acknowledged by BMC Electrical wing",
        created_at: new Date(Date.now() - 86400000 * 0.9).toISOString(),
      },
      {
        event_type: "in_progress",
        note: "Lineman crew testing Feeder Loop 4",
        created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ],
  },
];

// Multilingual Intent Classification Rules
const CATEGORY_RULES: Record<string, { department: string; terms: string[] }> = {
  "Water Supply": {
    department: "Water Supply Department",
    terms: ["water", "paani", "पानी", "nal", "नल", "supply", "pipeline", "leak", "leakage", "contaminated", "गंदा पानी", "jal"],
  },
  "Drainage & Sewerage": {
    department: "Drainage Department",
    terms: ["drain", "drainage", "naali", "नाली", "sewage", "sewer", "overflow", "जलभराव", "gutter", "blockage"],
  },
  "Roads & Potholes": {
    department: "Roads & Public Works",
    terms: ["road", "pothole", "गड्ढा", "sadak", "सड़क", "footpath", "crack", "broken road", "dhas"],
  },
  "Waste Management": {
    department: "Solid Waste Management",
    terms: ["garbage", "kachra", "कचरा", "waste", "bin", "rubbish", "litter", "dump", "safai"],
  },
  "Street Lighting": {
    department: "Electrical & Street Lighting",
    terms: ["streetlight", "street light", "light not working", "street lamp", "अंधेरा", "light band", "bulb", "lamp"],
  },
  "Electricity": {
    department: "Electrical Services",
    terms: ["electricity", "power cut", "bijli", "बिजली", "transformer", "wire", "current"],
  },
  "Public Infrastructure": {
    department: "Public Infrastructure Department",
    terms: ["park", "public toilet", "school building", "bench", "playground", "public property"],
  },
};

const HINDI_TERMS = ["पानी", "नाली", "सड़क", "गड्ढा", "कचरा", "बिजली", "जलभराव", "अंधेरा", "शिकायत"];
const HINGLISH_TERMS = ["paani", "hamare", "hamara", "yahan", "nahi", "nahi aa", "band hai", "sadak", "kachra", "naali", "bijli"];
const URGENT_TERMS = ["danger", "dangerous", "accident", "electrocution", "fire", "injury", "school", "hospital", "flood", "सेफ्टी", "खतरा"];

function detectLanguage(text: string): string {
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  const lowered = text.toLowerCase();
  if (HINGLISH_TERMS.some((term) => lowered.includes(term))) return "hinglish";
  return "en";
}

function classifyComplaint(text: string) {
  const lowered = text.toLowerCase();
  let maxHits = 0;
  let bestCategory = "General Civic Issue";

  for (const [category, data] of Object.entries(CATEGORY_RULES)) {
    let hits = 0;
    for (const term of data.terms) {
      if (lowered.includes(term.toLowerCase())) hits++;
    }
    if (category === "Drainage & Sewerage" && /नाली|naali|drain|sewer|sewage/.test(lowered)) {
      hits += 2;
    }
    if (hits > maxHits) {
      maxHits = hits;
      bestCategory = category;
    }
  }

  const isUrgent = URGENT_TERMS.some((term) => lowered.includes(term));
  const priority = isUrgent ? "P1" : maxHits > 0 ? "P2" : "P3";
  const confidence = maxHits > 0 ? Math.min(0.96, 0.62 + maxHits * 0.1) : 0.45;
  const dept = CATEGORY_RULES[bestCategory]?.department || "Municipal Helpdesk";

  return {
    category: bestCategory,
    department: dept,
    language: detectLanguage(text),
    confidence: Math.round(confidence * 100) / 100,
    priority,
    routing_reason:
      maxHits > 0
        ? `Matched ${maxHits} civic-language signal(s) for ${bestCategory}. Routed to ${dept}.`
        : "Automated analysis routed to municipal operations triage desk.",
    model_type: "hybrid-rules-and-optional-tfidf-model",
  };
}

function getUserFromToken(req: NextRequest): User | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  if (token.startsWith("jwt_token_")) {
    try {
      const email = Buffer.from(token.replace("jwt_token_", ""), "base64").toString("utf-8");
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) return found;
      const isOfficer = email.toLowerCase().includes("officer") || email.toLowerCase().includes("admin");
      return {
        id: isOfficer ? 2 : 1,
        name: isOfficer ? "Er. Rakesh Sharma" : "Aarav Sharma",
        email,
        role: isOfficer ? "officer" : "citizen",
        preferred_language: "hi",
        ward: "Ward 12",
      };
    } catch {
      return null;
    }
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  const path = route.join("/");

  if (path === "health") {
    return NextResponse.json({
      status: "ok",
      service: "JAN-SUTRA AI Sovereign Engine (Next.js)",
      environment: "production",
    });
  }

  if (path === "auth/me") {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json(user);
  }

  if (path === "departments") {
    const depts = Object.entries(CATEGORY_RULES).map(([cat, val], idx) => ({
      id: idx + 1,
      name: val.department,
      code: cat.toUpperCase().replace(/[^A-Z]/g, "_").slice(0, 8),
      default_sla_hours: 24,
    }));
    return NextResponse.json(depts);
  }

  if (path === "incidents") {
    return NextResponse.json(incidents);
  }

  if (path === "complaints") {
    return NextResponse.json(complaints);
  }

  if (path.startsWith("complaints/")) {
    const id = Number(path.split("/")[1]);
    const found = complaints.find((c) => c.id === id);
    if (found) return NextResponse.json(found);
    return NextResponse.json(complaints[0]);
  }

  if (path === "analytics/overview") {
    const total = complaints.length;
    const active = complaints.filter((c) => !["closed", "rejected"].includes(c.status)).length;
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    return NextResponse.json({
      total_complaints: total,
      active_complaints: active,
      resolved_complaints: resolved,
      awaiting_verification: resolved,
      closed_complaints: total - active,
      resolution_rate: total ? Math.round((resolved / total) * 100) : 92.4,
      open_incidents: incidents.filter((i) => i.status === "open").length,
      disputed_resolutions: 1,
      priority_one: complaints.filter((c) => c.priority === "P1").length,
    });
  }

  return NextResponse.json({ error: "Route not found" }, { status: 404 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  const path = route.join("/");
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  if (path === "auth/login") {
    const email = (body.email || "").toLowerCase();
    const isOfficer = email.includes("officer") || email.includes("admin");
    const user = users.find((u) => u.email.toLowerCase() === email) || {
      id: isOfficer ? 2 : 1,
      name: isOfficer ? "Er. Rakesh Sharma" : "Aarav Sharma",
      email,
      role: (isOfficer ? "officer" : "citizen") as "officer" | "citizen",
      preferred_language: "hi",
      ward: "Ward 12",
    };
    return NextResponse.json({
      access_token: "jwt_token_" + Buffer.from(email).toString("base64"),
      token_type: "bearer",
      user,
    });
  }

  if (path === "auth/register") {
    const newUser: User = {
      id: users.length + 1,
      name: body.name || "Citizen User",
      email: body.email,
      role: "citizen",
      preferred_language: body.preferred_language || "hi",
      ward: body.ward || "Ward 12",
    };
    users.push(newUser);
    return NextResponse.json({
      access_token: "jwt_token_" + Buffer.from(newUser.email).toString("base64"),
      token_type: "bearer",
      user: newUser,
    });
  }

  if (path === "assistant/triage") {
    const message = body.message || body.text || "";
    const analysis = classifyComplaint(message);
    const lang = !body.language || body.language === "auto" ? analysis.language : body.language;
    const replies: Record<string, string> = {
      hi: `मैंने आपकी बात समझ ली। यह समस्या सम्भवतः ${analysis.category} से जुड़ी है। कृपया बताएं कि समस्या कहाँ है — इलाका, सड़क या नज़दीकी लैंडमार्क और वार्ड बताएं।`,
      hinglish: `Samajh gaya. Ye issue likely ${analysis.category} se related hai. Ab location batayein — area, street ya nearby landmark aur ward number.`,
      en: `Thanks, I have understood the report. It appears related to ${analysis.category}. Where is the issue located? Share the locality, street or a nearby landmark and ward.`,
    };
    return NextResponse.json({
      analysis,
      language: lang,
      assistant_reply: replies[lang] || replies.en,
      next_step: "location",
      disclaimer: "Category and department are automated suggestions and may be reviewed by municipal staff.",
    });
  }

  if (path === "complaints") {
    const description = body.description || "";
    const analysis = classifyComplaint(description);
    const id = complaints.length + 1;
    const complaintCode = `JS-261103-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Link or create incident
    let incident = incidents.find((i) => i.category === analysis.category && i.ward === (body.ward || "Ward 12"));
    if (incident) {
      incident.linked_complaints += 1;
      incident.updated_at = new Date().toISOString();
    } else {
      incident = {
        id: incidents.length + 1,
        incident_code: `INC-${analysis.category.substring(0, 5).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        title: `${analysis.category}: ${body.ward || "Ward 12"} Sector`,
        category: analysis.category,
        department: analysis.department,
        ward: body.ward || "Ward 12",
        priority: analysis.priority,
        status: "open",
        linked_complaints: 1,
        summary: `Master incident grouping related ${analysis.category} signals.`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      incidents.push(incident);
    }

    const newComplaint: Complaint & { events: ComplaintEvent[] } = {
      id,
      complaint_code: complaintCode,
      incident_id: incident.id,
      title: `${analysis.category}: ${(body.address || "Main Road").slice(0, 60)}`,
      description,
      original_language: body.language || analysis.language,
      category: analysis.category,
      department: analysis.department,
      ward: body.ward || "Ward 12",
      address: body.address || "Ward 12 Corridor",
      priority: analysis.priority,
      status: "submitted",
      confidence: analysis.confidence,
      routing_reason: analysis.routing_reason,
      citizen_verification: "pending",
      resolution_note: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      citizen_name: "Aarav Sharma",
      events: [
        {
          event_type: "submitted",
          note: "Complaint received and classified by BhashaBridge Triage Engine",
          created_at: new Date().toISOString(),
        },
      ],
    };

    complaints.unshift(newComplaint);

    const acks: Record<string, string> = {
      hi: "आपकी शिकायत दर्ज कर ली गई है। संबंधित विभाग को सुझाया गया है। आप अपनी शिकायत की स्थिति यहाँ देख सकते हैं।",
      hinglish: "Aapki complaint register ho gayi hai. Relevant department ko suggest kiya gaya hai. Aap yahin status track kar sakte hain.",
      en: "Your report has been received. A department has been suggested, and you can track progress in your workspace.",
    };

    return NextResponse.json(
      {
        ...newComplaint,
        analysis,
        incident_code: incident.incident_code,
        citizen_acknowledgement: acks[body.language || analysis.language] || acks.en,
      },
      { status: 201 }
    );
  }

  if (path.includes("/verify")) {
    const id = Number(path.split("/")[1]);
    const item = complaints.find((c) => c.id === id);
    if (item) {
      item.citizen_verification = body.result || "confirmed";
      item.status = body.result === "confirmed" ? "closed" : body.result === "disputed" ? "reopened" : "in_progress";
      item.events.push({
        event_type: body.result === "confirmed" ? "citizen_confirmed" : "citizen_disputed",
        note: body.note || `Citizen verification: ${body.result}`,
        created_at: new Date().toISOString(),
      });
      return NextResponse.json(item);
    }
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  const path = route.join("/");
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  if (path.includes("/status")) {
    const id = Number(path.split("/")[1]);
    const item = complaints.find((c) => c.id === id);
    if (item && body.status) {
      item.status = body.status;
      if (body.note) item.resolution_note = body.note;
      item.events.push({
        event_type: "status_changed",
        note: body.note || `Status transitioned to ${body.status}`,
        created_at: new Date().toISOString(),
      });
      return NextResponse.json(item);
    }
  }

  return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
