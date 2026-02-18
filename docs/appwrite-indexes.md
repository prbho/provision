# Appwrite Index Coverage

This project includes a helper script to provision key indexes used by dashboard, purchases, and messaging queries:

```bash
npm run appwrite:indexes
```

Required environment variables:

- `APPWRITE_ENDPOINT`
- `APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`
- `APPWRITE_DATABASE_ID`

Optional collection overrides:

- `APPWRITE_PURCHASES_COLLECTION_ID` (defaults to `purchases`)
- `APPWRITE_MESSAGES_COLLECTION_ID` (defaults to `messages`)

Indexes created:

- `purchases.idx_purchases_buyer_created_desc`
- `purchases.idx_purchases_buyer_status_created_desc`
- `messages.idx_messages_from_to_sentAt`
- `messages.idx_messages_to_from_sentAt`
- `messages.idx_messages_property_sentAt`
