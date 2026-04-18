"""
OSINT Analysis System Backend
FastAPI backend with AI-powered analysis, alerts, and data ingestion
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from enum import Enum
import uuid
import random
import re
from collections import Counter

# Initialize FastAPI app
app = FastAPI(
    title="OSINT Analysis System API",
    description="AI-powered OSINT analysis with sentiment analysis, NER, and alerting",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# ENUMS AND MODELS
# ============================================================================

class Platform(str, Enum):
    TWITTER = "twitter"
    REDDIT = "reddit"
    TELEGRAM = "telegram"
    NEWS = "news"
    DARK_WEB = "dark_web"
    FORUMS = "forums"

class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertType(str, Enum):
    SPIKE = "spike"
    SENTIMENT = "sentiment"
    KEYWORD = "keyword"
    ENTITY = "entity"
    ANOMALY = "anomaly"

# Pydantic Models
class Entity(BaseModel):
    type: str
    value: str
    confidence: float

class FeedItem(BaseModel):
    id: str
    platform: Platform
    content: str
    author: str
    timestamp: datetime
    url: str
    sentiment: Sentiment
    sentiment_score: float
    entities: List[Entity]
    topics: List[str]
    engagement: Dict[str, int]
    risk_score: float
    location: Optional[str] = None
    language: str = "en"

class Alert(BaseModel):
    id: str
    type: AlertType
    severity: AlertSeverity
    title: str
    description: str
    timestamp: datetime
    source_items: List[str]
    is_read: bool = False
    metadata: Dict[str, Any] = {}

class AnalyticsData(BaseModel):
    sentiment_distribution: Dict[str, int]
    platform_distribution: Dict[str, int]
    topic_trends: List[Dict[str, Any]]
    entity_frequency: List[Dict[str, Any]]
    volume_over_time: List[Dict[str, Any]]
    risk_distribution: Dict[str, int]

class IngestRequest(BaseModel):
    platform: Platform
    content: str
    author: str
    url: str = ""
    metadata: Dict[str, Any] = {}

class MonitorKeyword(BaseModel):
    id: str
    keyword: str
    is_active: bool = True
    created_at: datetime
    hit_count: int = 0

# ============================================================================
# IN-MEMORY DATA STORES
# ============================================================================

feed_items: Dict[str, FeedItem] = {}
alerts: Dict[str, Alert] = {}
monitor_keywords: Dict[str, MonitorKeyword] = {}
users: Dict[str, Dict[str, Any]] = {
    "admin": {
        "id": "admin",
        "username": "admin",
        "password": "admin123",  # In production, use proper hashing
        "role": "admin"
    }
}

# ============================================================================
# AI ANALYSIS MODULE
# ============================================================================

class AIAnalyzer:
    """AI-powered text analysis using rule-based approaches and TextBlob"""
    
    # Sentiment lexicons
    POSITIVE_WORDS = {
        "good", "great", "excellent", "amazing", "wonderful", "fantastic", "love",
        "happy", "joy", "success", "win", "benefit", "positive", "improve", "best",
        "perfect", "beautiful", "awesome", "brilliant", "superb", "outstanding"
    }
    
    NEGATIVE_WORDS = {
        "bad", "terrible", "awful", "horrible", "hate", "angry", "sad", "fail",
        "loss", "threat", "danger", "attack", "breach", "hack", "malware", "virus",
        "exploit", "vulnerability", "risk", "crisis", "emergency", "warning"
    }
    
    # Entity patterns
    ENTITY_PATTERNS = {
        "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        "ip_address": r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
        "url": r'https?://[^\s<>"{}|\\^`\[\]]+',
        "crypto_wallet": r'\b(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{39,59})\b',
        "phone": r'\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b',
        "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
        "credit_card": r'\b(?:\d{4}[-\s]?){3}\d{4}\b',
    }
    
    # Topic keywords
    TOPIC_KEYWORDS = {
        "cybersecurity": ["hack", "breach", "malware", "ransomware", "phishing", "exploit", "vulnerability", "cyber", "security"],
        "cryptocurrency": ["bitcoin", "ethereum", "crypto", "blockchain", "wallet", "token", "nft", "defi", "mining"],
        "politics": ["government", "election", "president", "congress", "policy", "vote", "politician", "democracy"],
        "technology": ["ai", "artificial intelligence", "machine learning", "software", "hardware", "tech", "innovation"],
        "finance": ["stock", "market", "investment", "bank", "trading", "economy", "inflation", "interest rate"],
        "threat_intelligence": ["apt", "threat actor", "campaign", "ioc", "indicator", "ttps", "mitre", "attack"],
    }
    
    # High-risk keywords for risk scoring
    HIGH_RISK_KEYWORDS = [
        "breach", "leak", "attack", "exploit", "ransomware", "stolen", "credentials",
        "zero-day", "vulnerability", "compromise", "malware", "ddos", "botnet"
    ]
    
    @classmethod
    def analyze_sentiment(cls, text: str) -> tuple[Sentiment, float]:
        """Analyze sentiment using lexicon-based approach"""
        text_lower = text.lower()
        words = set(re.findall(r'\b\w+\b', text_lower))
        
        positive_count = len(words & cls.POSITIVE_WORDS)
        negative_count = len(words & cls.NEGATIVE_WORDS)
        
        total = positive_count + negative_count
        if total == 0:
            return Sentiment.NEUTRAL, 0.0
        
        score = (positive_count - negative_count) / max(len(words), 1)
        score = max(-1.0, min(1.0, score * 5))  # Normalize to -1 to 1
        
        if score > 0.1:
            return Sentiment.POSITIVE, score
        elif score < -0.1:
            return Sentiment.NEGATIVE, score
        else:
            return Sentiment.NEUTRAL, score
    
    @classmethod
    def extract_entities(cls, text: str) -> List[Entity]:
        """Extract named entities using regex patterns"""
        entities = []
        
        for entity_type, pattern in cls.ENTITY_PATTERNS.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                # Handle tuple matches from groups
                value = match if isinstance(match, str) else match[0] if match else ""
                if value:
                    entities.append(Entity(
                        type=entity_type,
                        value=value,
                        confidence=0.85 + random.uniform(0, 0.15)
                    ))
        
        # Extract potential organization/person names (capitalized words)
        capitalized = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        for name in capitalized[:5]:  # Limit to first 5
            if len(name) > 3:
                entities.append(Entity(
                    type="organization" if len(name.split()) > 1 else "person",
                    value=name,
                    confidence=0.6 + random.uniform(0, 0.2)
                ))
        
        return entities
    
    @classmethod
    def classify_topics(cls, text: str) -> List[str]:
        """Classify text into topics based on keyword matching"""
        text_lower = text.lower()
        topics = []
        
        for topic, keywords in cls.TOPIC_KEYWORDS.items():
            if any(kw in text_lower for kw in keywords):
                topics.append(topic)
        
        return topics if topics else ["general"]
    
    @classmethod
    def calculate_risk_score(cls, text: str, sentiment_score: float, entities: List[Entity]) -> float:
        """Calculate risk score (0-100) based on multiple factors"""
        text_lower = text.lower()
        
        # Base risk from high-risk keywords
        keyword_risk = sum(10 for kw in cls.HIGH_RISK_KEYWORDS if kw in text_lower)
        keyword_risk = min(keyword_risk, 50)  # Cap at 50
        
        # Risk from negative sentiment
        sentiment_risk = max(0, -sentiment_score * 20)
        
        # Risk from sensitive entities
        entity_risk = 0
        sensitive_types = {"ssn", "credit_card", "crypto_wallet"}
        for entity in entities:
            if entity.type in sensitive_types:
                entity_risk += 15
        entity_risk = min(entity_risk, 30)
        
        total_risk = keyword_risk + sentiment_risk + entity_risk
        return min(100, max(0, total_risk))
    
    @classmethod
    def generate_summary(cls, text: str, max_sentences: int = 2) -> str:
        """Generate extractive summary by selecting key sentences"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        if not sentences:
            return text[:200] + "..." if len(text) > 200 else text
        
        # Score sentences by keyword presence
        scored = []
        for sent in sentences:
            sent_lower = sent.lower()
            score = sum(1 for kw in cls.HIGH_RISK_KEYWORDS if kw in sent_lower)
            score += len(re.findall(r'\b[A-Z][a-z]+\b', sent)) * 0.5  # Named entities
            scored.append((score, sent))
        
        scored.sort(reverse=True)
        summary_sentences = [s[1] for s in scored[:max_sentences]]
        
        return ". ".join(summary_sentences) + "."

# ============================================================================
# ALERT ENGINE
# ============================================================================

class AlertEngine:
    """Engine for generating alerts based on analysis"""
    
    # Thresholds
    SPIKE_THRESHOLD = 3  # 3x normal volume
    SENTIMENT_THRESHOLD = -0.5  # Negative sentiment threshold
    RISK_THRESHOLD = 70  # High risk threshold
    
    @classmethod
    def check_spike_alert(cls, platform: Platform, window_minutes: int = 60) -> Optional[Alert]:
        """Check for volume spikes in the last window"""
        now = datetime.utcnow()
        cutoff = now - timedelta(minutes=window_minutes)
        
        recent_items = [
            item for item in feed_items.values()
            if item.platform == platform and item.timestamp > cutoff
        ]
        
        # Compare to previous period
        prev_cutoff = cutoff - timedelta(minutes=window_minutes)
        prev_items = [
            item for item in feed_items.values()
            if item.platform == platform and prev_cutoff < item.timestamp <= cutoff
        ]
        
        if len(prev_items) > 0 and len(recent_items) / len(prev_items) >= cls.SPIKE_THRESHOLD:
            return Alert(
                id=str(uuid.uuid4()),
                type=AlertType.SPIKE,
                severity=AlertSeverity.HIGH,
                title=f"Volume Spike Detected on {platform.value}",
                description=f"Activity increased {len(recent_items) / len(prev_items):.1f}x in the last {window_minutes} minutes",
                timestamp=now,
                source_items=[item.id for item in recent_items[:10]],
                metadata={"platform": platform.value, "volume": len(recent_items)}
            )
        return None
    
    @classmethod
    def check_sentiment_alert(cls, item: FeedItem) -> Optional[Alert]:
        """Check for negative sentiment surge"""
        if item.sentiment_score < cls.SENTIMENT_THRESHOLD:
            return Alert(
                id=str(uuid.uuid4()),
                type=AlertType.SENTIMENT,
                severity=AlertSeverity.MEDIUM if item.sentiment_score > -0.7 else AlertSeverity.HIGH,
                title=f"Negative Sentiment Detected",
                description=f"Highly negative content detected from {item.author} on {item.platform.value}",
                timestamp=datetime.utcnow(),
                source_items=[item.id],
                metadata={"sentiment_score": item.sentiment_score}
            )
        return None
    
    @classmethod
    def check_keyword_alert(cls, item: FeedItem) -> Optional[Alert]:
        """Check if monitored keywords are present"""
        content_lower = item.content.lower()
        triggered_keywords = []
        
        for kw in monitor_keywords.values():
            if kw.is_active and kw.keyword.lower() in content_lower:
                triggered_keywords.append(kw.keyword)
                kw.hit_count += 1
        
        if triggered_keywords:
            return Alert(
                id=str(uuid.uuid4()),
                type=AlertType.KEYWORD,
                severity=AlertSeverity.MEDIUM,
                title=f"Monitored Keyword Match",
                description=f"Keywords [{', '.join(triggered_keywords)}] detected in {item.platform.value} content",
                timestamp=datetime.utcnow(),
                source_items=[item.id],
                metadata={"keywords": triggered_keywords}
            )
        return None
    
    @classmethod
    def check_risk_alert(cls, item: FeedItem) -> Optional[Alert]:
        """Check for high-risk content"""
        if item.risk_score >= cls.RISK_THRESHOLD:
            severity = AlertSeverity.CRITICAL if item.risk_score >= 90 else AlertSeverity.HIGH
            return Alert(
                id=str(uuid.uuid4()),
                type=AlertType.ANOMALY,
                severity=severity,
                title=f"High Risk Content Detected",
                description=f"Content with risk score {item.risk_score:.0f}/100 detected on {item.platform.value}",
                timestamp=datetime.utcnow(),
                source_items=[item.id],
                metadata={"risk_score": item.risk_score, "topics": item.topics}
            )
        return None

# ============================================================================
# SEED DATA GENERATOR
# ============================================================================

def generate_seed_data():
    """Generate realistic seed data for demonstration"""
    
    sample_contents = [
        ("twitter", "Breaking: Major data breach at TechCorp exposes 10M user credentials. Hackers demanding ransom in Bitcoin. Stay vigilant! #cybersecurity #breach", "CyberNewsDaily"),
        ("reddit", "Found a new phishing campaign targeting bank customers. The emails look very convincing. Check the sender address before clicking any links.", "security_researcher42"),
        ("telegram", "Alert: Ransomware group LockBit claims attack on healthcare provider. Patient data potentially compromised. IOCs available.", "ThreatIntelChannel"),
        ("news", "Government announces new cybersecurity framework requirements for critical infrastructure. Companies have 90 days to comply.", "TechNews"),
        ("twitter", "Just discovered a zero-day vulnerability in popular router firmware. Responsible disclosure in progress. Patch expected next week.", "WhiteHatHacker"),
        ("forums", "Selling fresh database dumps from recent retail breach. 5M records including emails, hashed passwords. Contact via secure channel.", "dark_vendor_x"),
        ("reddit", "Our company just completed SOC 2 certification! Great success for the security team. Hard work pays off.", "proud_ciso"),
        ("news", "Stock market reaches new highs as tech sector leads gains. AI companies see particularly strong performance.", "FinanceDaily"),
        ("twitter", "New cryptocurrency scam alert: Fake airdrop claiming to be from Ethereum Foundation. Do not connect your wallet!", "CryptoWatchdog"),
        ("telegram", "APT group suspected in recent supply chain attack. TTPs consistent with nation-state actor. MITRE ATT&CK mapping attached.", "MalwareHunters"),
        ("dark_web", "Offering access to compromised corporate VPN accounts. Major tech companies available. BTC only.", "access_dealer"),
        ("reddit", "Looking for recommendations on SIEM solutions for mid-size company. Currently evaluating Splunk vs Elastic.", "it_admin_help"),
        ("news", "Election security concerns rise as voting day approaches. Officials urge vigilance against misinformation campaigns.", "PoliticsToday"),
        ("twitter", "Happy to announce our open-source threat intelligence platform is now available! Check it out on GitHub. #opensource #threatintel", "SecurityStartup"),
        ("forums", "Tutorial: How to set up a secure home network with proper segmentation. Beginner friendly guide inside.", "network_guru"),
    ]
    
    now = datetime.utcnow()
    
    for i, (platform, content, author) in enumerate(sample_contents):
        # Analyze content
        sentiment, sentiment_score = AIAnalyzer.analyze_sentiment(content)
        entities = AIAnalyzer.extract_entities(content)
        topics = AIAnalyzer.classify_topics(content)
        risk_score = AIAnalyzer.calculate_risk_score(content, sentiment_score, entities)
        
        item = FeedItem(
            id=str(uuid.uuid4()),
            platform=Platform(platform),
            content=content,
            author=author,
            timestamp=now - timedelta(hours=random.randint(0, 48), minutes=random.randint(0, 59)),
            url=f"https://{platform}.example.com/post/{uuid.uuid4().hex[:8]}",
            sentiment=sentiment,
            sentiment_score=sentiment_score,
            entities=entities,
            topics=topics,
            engagement={
                "likes": random.randint(0, 1000),
                "shares": random.randint(0, 200),
                "comments": random.randint(0, 100)
            },
            risk_score=risk_score,
            location=random.choice([None, "US", "UK", "DE", "RU", "CN"]),
            language="en"
        )
        feed_items[item.id] = item
        
        # Generate alerts for high-risk items
        if alert := AlertEngine.check_risk_alert(item):
            alerts[alert.id] = alert
        if alert := AlertEngine.check_sentiment_alert(item):
            alerts[alert.id] = alert
    
    # Add some default monitored keywords
    default_keywords = ["breach", "ransomware", "zero-day", "leak", "exploit"]
    for kw in default_keywords:
        keyword = MonitorKeyword(
            id=str(uuid.uuid4()),
            keyword=kw,
            is_active=True,
            created_at=now - timedelta(days=random.randint(1, 30)),
            hit_count=random.randint(0, 50)
        )
        monitor_keywords[keyword.id] = keyword

# Generate seed data on startup
generate_seed_data()

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# --- Authentication ---

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: Dict[str, Any]

@app.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user and return token"""
    user = users.get(request.username)
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate simple token (in production, use JWT)
    token = f"token_{uuid.uuid4().hex}"
    return LoginResponse(
        token=token,
        user={"id": user["id"], "username": user["username"], "role": user["role"]}
    )

@app.post("/auth/logout")
async def logout():
    """Logout user"""
    return {"message": "Logged out successfully"}

# --- Feed Endpoints ---

@app.get("/feeds")
async def get_feeds(
    platform: Optional[Platform] = None,
    sentiment: Optional[Sentiment] = None,
    topic: Optional[str] = None,
    min_risk: Optional[float] = None,
    search: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    offset: int = 0
):
    """Get feed items with optional filters"""
    items = list(feed_items.values())
    
    # Apply filters
    if platform:
        items = [i for i in items if i.platform == platform]
    if sentiment:
        items = [i for i in items if i.sentiment == sentiment]
    if topic:
        items = [i for i in items if topic.lower() in [t.lower() for t in i.topics]]
    if min_risk is not None:
        items = [i for i in items if i.risk_score >= min_risk]
    if search:
        search_lower = search.lower()
        items = [i for i in items if search_lower in i.content.lower() or search_lower in i.author.lower()]
    
    # Sort by timestamp (newest first)
    items.sort(key=lambda x: x.timestamp, reverse=True)
    
    # Paginate
    total = len(items)
    items = items[offset:offset + limit]
    
    return {
        "items": [item.model_dump() for item in items],
        "total": total,
        "limit": limit,
        "offset": offset
    }

@app.get("/feeds/{item_id}")
async def get_feed_item(item_id: str):
    """Get a specific feed item with full analysis"""
    item = feed_items.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Feed item not found")
    
    # Generate summary
    summary = AIAnalyzer.generate_summary(item.content)
    
    return {
        **item.model_dump(),
        "summary": summary
    }

# --- Alert Endpoints ---

@app.get("/alerts")
async def get_alerts(
    severity: Optional[AlertSeverity] = None,
    alert_type: Optional[AlertType] = None,
    is_read: Optional[bool] = None,
    limit: int = Query(default=50, le=100),
    offset: int = 0
):
    """Get alerts with optional filters"""
    items = list(alerts.values())
    
    if severity:
        items = [a for a in items if a.severity == severity]
    if alert_type:
        items = [a for a in items if a.type == alert_type]
    if is_read is not None:
        items = [a for a in items if a.is_read == is_read]
    
    items.sort(key=lambda x: x.timestamp, reverse=True)
    total = len(items)
    items = items[offset:offset + limit]
    
    return {
        "items": [item.model_dump() for item in items],
        "total": total,
        "limit": limit,
        "offset": offset
    }

@app.patch("/alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str):
    """Mark an alert as read"""
    alert = alerts.get(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_read = True
    return alert.model_dump()

@app.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: str):
    """Delete an alert"""
    if alert_id not in alerts:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    del alerts[alert_id]
    return {"message": "Alert deleted"}

# --- Analytics Endpoints ---

@app.get("/analytics")
async def get_analytics(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    """Get aggregated analytics data"""
    items = list(feed_items.values())
    
    # Filter by date range
    if start_date:
        items = [i for i in items if i.timestamp >= start_date]
    if end_date:
        items = [i for i in items if i.timestamp <= end_date]
    
    # Sentiment distribution
    sentiment_dist = Counter(i.sentiment.value for i in items)
    
    # Platform distribution
    platform_dist = Counter(i.platform.value for i in items)
    
    # Topic trends
    all_topics = [topic for i in items for topic in i.topics]
    topic_counts = Counter(all_topics)
    topic_trends = [{"topic": t, "count": c} for t, c in topic_counts.most_common(10)]
    
    # Entity frequency
    all_entities = [(e.type, e.value) for i in items for e in i.entities]
    entity_counts = Counter(all_entities)
    entity_freq = [
        {"type": e[0], "value": e[1], "count": c}
        for e, c in entity_counts.most_common(20)
    ]
    
    # Volume over time (hourly buckets)
    volume_by_hour: Dict[str, int] = {}
    for item in items:
        hour_key = item.timestamp.strftime("%Y-%m-%d %H:00")
        volume_by_hour[hour_key] = volume_by_hour.get(hour_key, 0) + 1
    
    volume_over_time = [
        {"timestamp": k, "count": v}
        for k, v in sorted(volume_by_hour.items())
    ]
    
    # Risk distribution
    risk_buckets = {"low": 0, "medium": 0, "high": 0, "critical": 0}
    for item in items:
        if item.risk_score < 25:
            risk_buckets["low"] += 1
        elif item.risk_score < 50:
            risk_buckets["medium"] += 1
        elif item.risk_score < 75:
            risk_buckets["high"] += 1
        else:
            risk_buckets["critical"] += 1
    
    return {
        "sentiment_distribution": dict(sentiment_dist),
        "platform_distribution": dict(platform_dist),
        "topic_trends": topic_trends,
        "entity_frequency": entity_freq,
        "volume_over_time": volume_over_time,
        "risk_distribution": risk_buckets,
        "total_items": len(items),
        "avg_risk_score": sum(i.risk_score for i in items) / len(items) if items else 0
    }

@app.get("/analytics/summary")
async def get_analytics_summary():
    """Get quick summary stats"""
    items = list(feed_items.values())
    alert_list = list(alerts.values())
    
    # Recent items (last 24h)
    cutoff = datetime.utcnow() - timedelta(hours=24)
    recent_items = [i for i in items if i.timestamp > cutoff]
    
    return {
        "total_items": len(items),
        "items_24h": len(recent_items),
        "total_alerts": len(alert_list),
        "unread_alerts": sum(1 for a in alert_list if not a.is_read),
        "critical_alerts": sum(1 for a in alert_list if a.severity == AlertSeverity.CRITICAL),
        "avg_risk_score": sum(i.risk_score for i in items) / len(items) if items else 0,
        "high_risk_count": sum(1 for i in items if i.risk_score >= 70),
        "platforms_active": len(set(i.platform for i in recent_items))
    }

# --- Ingest Endpoint ---

@app.post("/ingest")
async def ingest_content(request: IngestRequest):
    """Ingest new content for analysis"""
    # Analyze content
    sentiment, sentiment_score = AIAnalyzer.analyze_sentiment(request.content)
    entities = AIAnalyzer.extract_entities(request.content)
    topics = AIAnalyzer.classify_topics(request.content)
    risk_score = AIAnalyzer.calculate_risk_score(request.content, sentiment_score, entities)
    
    # Create feed item
    item = FeedItem(
        id=str(uuid.uuid4()),
        platform=request.platform,
        content=request.content,
        author=request.author,
        timestamp=datetime.utcnow(),
        url=request.url or f"https://{request.platform.value}.example.com/post/{uuid.uuid4().hex[:8]}",
        sentiment=sentiment,
        sentiment_score=sentiment_score,
        entities=entities,
        topics=topics,
        engagement={"likes": 0, "shares": 0, "comments": 0},
        risk_score=risk_score,
        language="en"
    )
    
    feed_items[item.id] = item
    
    # Check for alerts
    generated_alerts = []
    
    if alert := AlertEngine.check_risk_alert(item):
        alerts[alert.id] = alert
        generated_alerts.append(alert.model_dump())
    
    if alert := AlertEngine.check_sentiment_alert(item):
        alerts[alert.id] = alert
        generated_alerts.append(alert.model_dump())
    
    if alert := AlertEngine.check_keyword_alert(item):
        alerts[alert.id] = alert
        generated_alerts.append(alert.model_dump())
    
    return {
        "item": item.model_dump(),
        "alerts_generated": generated_alerts,
        "summary": AIAnalyzer.generate_summary(request.content)
    }

# --- Monitor Keywords Endpoints ---

@app.get("/monitor/keywords")
async def get_keywords():
    """Get all monitored keywords"""
    return {
        "keywords": [kw.model_dump() for kw in monitor_keywords.values()]
    }

@app.post("/monitor/keywords")
async def add_keyword(keyword: str):
    """Add a new keyword to monitor"""
    kw = MonitorKeyword(
        id=str(uuid.uuid4()),
        keyword=keyword,
        is_active=True,
        created_at=datetime.utcnow(),
        hit_count=0
    )
    monitor_keywords[kw.id] = kw
    return kw.model_dump()

@app.delete("/monitor/keywords/{keyword_id}")
async def delete_keyword(keyword_id: str):
    """Delete a monitored keyword"""
    if keyword_id not in monitor_keywords:
        raise HTTPException(status_code=404, detail="Keyword not found")
    
    del monitor_keywords[keyword_id]
    return {"message": "Keyword deleted"}

@app.patch("/monitor/keywords/{keyword_id}/toggle")
async def toggle_keyword(keyword_id: str):
    """Toggle keyword active status"""
    kw = monitor_keywords.get(keyword_id)
    if not kw:
        raise HTTPException(status_code=404, detail="Keyword not found")
    
    kw.is_active = not kw.is_active
    return kw.model_dump()

# --- Analysis Endpoint ---

@app.post("/analyze")
async def analyze_text(content: str):
    """Analyze arbitrary text without ingesting"""
    sentiment, sentiment_score = AIAnalyzer.analyze_sentiment(content)
    entities = AIAnalyzer.extract_entities(content)
    topics = AIAnalyzer.classify_topics(content)
    risk_score = AIAnalyzer.calculate_risk_score(content, sentiment_score, entities)
    summary = AIAnalyzer.generate_summary(content)
    
    return {
        "sentiment": sentiment.value,
        "sentiment_score": sentiment_score,
        "entities": [e.model_dump() for e in entities],
        "topics": topics,
        "risk_score": risk_score,
        "summary": summary
    }
