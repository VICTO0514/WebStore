# Vimal Store REST API (`/api/v1`)

Base URL examples:
- Local: `http://localhost:8080/api/v1`
- Production: `https://your-api.onrender.com/api/v1`

Authentication: `Authorization: Bearer <JWT>` for protected routes.

## Auth
| Method | Path | Body | Notes |
|--------|------|------|--------|
| POST | `/auth/register` | `{ email, password, fullName, phone?, preferredLanguage? }` | Creates customer |
| POST | `/auth/login` | `{ email, password }` | Returns JWT |

## Catalog (public)
| GET | `/categories` | List categories |
| GET | `/products` | `?page=&size=&category=<slug>&q=&sort=name|price_asc|price_desc|newest` |
| GET | `/products/featured` | Featured products |
| GET | `/products/{id}` | Product detail |

## Delivery (public)
| GET | `/delivery/check` | `?lat=&lng=` | `{ distanceKm, eligible, maxRadiusKm }` |

## Settings (public)
| GET | `/settings/public` | Key/value map (`shop.name`, coordinates, etc.) |

## Cart (auth)
| GET | `/cart` |
| POST | `/cart/items` | `{ productId, quantity }` |
| PATCH | `/cart/items/{itemId}` | `{ quantity }` |
| DELETE | `/cart/items/{itemId}` |

## Addresses (auth)
| GET | `/addresses` |
| POST | `/addresses` | `{ label?, line1, line2?, city, state?, postalCode?, latitude, longitude, defaultAddress }` |
| DELETE | `/addresses/{id}` |

## Checkout & orders (auth)
| GET | `/checkout/preview` | `?addressId=&couponCode=` |
| POST | `/checkout/place` | `{ addressId, paymentMethod: COD\|STORE_QR, couponCode?, notes? }` |
| GET | `/orders` | Paginated order history |
| GET | `/orders/{orderNumber}` | Detail |

## Payments (auth)

| POST | `/payments/razorpay/verify` | **501 Not Implemented** — legacy path; no online gateway is configured. |


## Reviews
| GET | `/reviews/product/{productId}` | Public |
| POST | `/reviews` | `{ productId, orderId?, rating, title?, comment? }` auth |

## AI
| GET | `/ai/nl-search` | `?q=` public natural-language style search |
| POST | `/ai/chat` | `{ sessionId?, message }` auth |
| POST | `/ai/chat/guest` | Guest chat (stores transcript) |
| GET | `/ai/recommend/fbt/{productId}` | Frequently bought together |
| POST | `/ai/recommend/personalized` | `{ productIds: [] }` |

## Admin (`ROLE_ADMIN`)
| GET | `/admin/dashboard` | KPI map |
| GET | `/admin/orders` | All orders |
| PATCH | `/admin/orders/{orderNumber}/status` | `?status=PENDING|CONFIRMED|...` |
| POST | `/admin/products` | Create product |
| PUT | `/admin/products/{id}` | Update product |
| PATCH | `/admin/reviews/{id}/visibility` | `?visible=true|false` |

Default admin (seeded at startup if missing): values from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env` — defaults are **`admin@example.local`** / **`ChangeMe_LocalDev_Only`** (see **`backend/.env.example`**). Change before production.
