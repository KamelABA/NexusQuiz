import { Router } from 'express'
import Visitor from '../models/Visitor.js'

const router = Router()

// POST /api/visitors - Track a visitor
router.post('/', async (req, res) => {
  try {
    // Get IP address from various sources, prioritizing forwarded headers
    let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             req.headers['x-real-ip'] ||
             req.connection?.remoteAddress ||
             req.socket?.remoteAddress ||
             req.ip ||
             'unknown'
    
    // Remove IPv6 prefix if present (::ffff:)
    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7)
    }
    
    // Normalize localhost IPs to 'localhost' for consistency
    if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
      ip = 'localhost'
    }
    
    // Log for debugging (can be removed in production)
    console.log('Visitor IP:', ip, 'from', req.get('user-agent')?.substring(0, 50) || 'unknown')
    
    const userAgent = req.get('user-agent') || 'unknown'
    
    await Visitor.create({ ip, userAgent })
    return res.status(201).json({ success: true, ip })
  } catch (err) {
    console.error('Error tracking visitor:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/visitors/count - Get total visitor count
router.get('/count', async (req, res) => {
  try {
    const totalVisits = await Visitor.countDocuments({})
    const uniqueVisitors = await Visitor.distinct('ip').then(ips => ips.length)
    return res.json({ 
      totalVisits,
      uniqueVisitors,
      count: totalVisits // Keep for backward compatibility
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router

