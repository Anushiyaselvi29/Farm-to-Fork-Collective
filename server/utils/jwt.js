// ============================================
// JSON WEB TOKEN (JWT) RFC 7519 IMPLEMENTATION
// Native Node.js crypto HS256 JWT utility
// Farm to Fork Collective
// ============================================

const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'farm_to_fork_jwt_secure_key_2026_super_secret';
const DEFAULT_EXPIRY_SECONDS = 24 * 60 * 60; // 24 hours

// Helper: base64url encode
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Helper: base64url decode
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Sign a JWT token using HS256
 * @param {Object} payload - Data to embed in the token
 * @param {String} [secret] - Optional custom secret
 * @param {Object} [options] - Options (expiresIn seconds)
 * @returns {String} Standard JWT token (header.payload.signature)
 */
function sign(payload, secret = JWT_SECRET, options = {}) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = options.expiresIn || DEFAULT_EXPIRY_SECONDS;

  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
    iss: 'farm-to-fork-collective'
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode a JWT token
 * @param {String} token - Standard JWT string
 * @param {String} [secret] - Secret used to sign
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
function verify(token, secret = JWT_SECRET) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token is missing or invalid.');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed JWT token structure.');
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  // Verify HMAC-SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    throw new Error('Invalid JWT signature.');
  }

  // Parse and verify payload
  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error('JWT token has expired.');
  }

  return payload;
}

/**
 * Express Middleware to authenticate JWT Bearer token
 */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No authorization token provided. Please log in.'
    });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: `Authentication failed: ${err.message}`
    });
  }
}

/**
 * Express Middleware for Role-Based Access Control (RBAC)
 * @param {Array<String>|String} allowedRoles
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of following roles: ${roles.join(', ')}`
      });
    }
    next();
  };
}

module.exports = {
  sign,
  verify,
  authenticateJWT,
  requireRole,
  JWT_SECRET
};
