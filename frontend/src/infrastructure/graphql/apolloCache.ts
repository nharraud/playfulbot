import { InMemoryCache } from '@apollo/client';

export const apolloCache = new InMemoryCache({
  typePolicies: {
    Tournament: {
      fields: {
        rounds: {
          // Don't cache separate results based on
          // any of this field's arguments.
          keyArgs: false,
          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing: { __ref: string }[] = [], incoming: { __ref: string }[], { readField }) {
            if (incoming === null) {
              return existing;
            }
            const union = new Set<string>();
            existing.forEach((round) => {
              union.add(round.__ref);
            });
            incoming.forEach((round) => {
              union.add(round.__ref);
            });
            const withDate = [...union.values()].map((ref) => ({
              __ref: ref,
              startDate: readField<string>('startDate', { __ref: ref }),
            }));
            return withDate.sort((a, b) =>
              a.startDate < b.startDate ? -1 : a.startDate === b.startDate ? 0 : 1
            );
          },
        },
      },
    },
  },
});
