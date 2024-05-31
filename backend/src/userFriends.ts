import neo4j, { Session } from "neo4j-driver";

import User from "./models/User.js";
import { filterUser, getUser } from "./users.js";

export async function getFriends(
  session: Session,
  userId: string,
  pageIndex: number,
  pageSize: number,
): Promise<User[] | null> {
  const user = await getUser(session, { id: userId });
  if (!user) {
    return null;
  }

  const querySkip = neo4j.int(pageIndex * pageSize);
  const queryLimit = neo4j.int(pageSize);

  const friendRequest = await session.run(
    `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]-(f:User)
     RETURN DISTINCT f
     SKIP $querySkip
     LIMIT $queryLimit`,
    { userId, querySkip, queryLimit },
  );

  const friends = friendRequest.records.map((f) =>
    filterUser(f.get("f").properties),
  );
  return friends;
}

export async function getFriendsCount(
  session: Session,
  userId: string,
): Promise<neo4j.Integer | null> {
  const user = await getUser(session, { id: userId });
  if (!user) {
    return null;
  }

  const friendsCountRequest = await session.run(
    `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]-(f:User)
     RETURN count(DISTINCT f)`,
    { userId },
  );

  const friendsCount = friendsCountRequest.records[0].get(0);
  return friendsCount;
}

export async function isFriend(
  session: Session,
  firstUserId: string,
  secondUserId: string,
) {
  try {
    const request = await session.run(
      `
      MATCH (u1:User {id: $firstUserId})
      MATCH (u2:User {id: $secondUserId})
      RETURN exists((u1)-[:IS_FRIENDS_WITH]-(u2))
      `,
      { firstUserId, secondUserId },
    );

    return request.records?.[0].get(0);
  } catch (err) {
    return false;
  }
}

export async function getFriendRequests(
  session: Session,
  userId: string,
  pageIndex: number,
  pageSize: number,
): Promise<User[] | null> {
  const user = await getUser(session, { id: userId });
  if (!user) {
    return null;
  }

  const querySkip = neo4j.int(pageIndex * pageSize);
  const queryLimit = neo4j.int(pageSize);

  const friendRequestsRequest = await session.run(
    `MATCH (u:User {id: $userId})<-[:SENT_INVITE_TO]-(f:User)
     WITH f ORDER BY f.last_name, f.first_name
     RETURN DISTINCT f
     SKIP $querySkip
     LIMIT $queryLimit`,
    { userId, querySkip, queryLimit },
  );

  const friends = friendRequestsRequest.records.map((f) =>
    filterUser(f.get("f").properties),
  );
  return friends;
}

export async function getFriendRequestsCount(
  session: Session,
  userId: string,
): Promise<neo4j.Integer | null> {
  const user = await getUser(session, { id: userId });
  if (!user) {
    return null;
  }

  const friendRequestsCountRequest = await session.run(
    `MATCH (u:User {id: $userId})<-[:SENT_INVITE_TO]-(f:User)
     RETURN count(DISTINCT f)`,
    { userId },
  );

  const friendRequestsCount = friendRequestsCountRequest.records[0].get(0);
  return friendRequestsCount;
}

export async function getFriendSuggestions(
  session: Session,
  userId: string,
  pageIndex: number,
  pageSize: number,
): Promise<User[] | null> {
  const user = await getUser(session, { id: userId });
  if (!user) {
    return null;
  }

  const querySkip = neo4j.int(pageIndex * pageSize);
  const queryLimit = neo4j.int(pageSize);

  const friendSuggestionsRequest = await session.run(
    `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]-(f:User)-[:IS_FRIENDS_WITH]-(s:User)
     WHERE NOT (u)-[:IS_FRIENDS_WITH]-(s) AND s.id <> $userId
     RETURN DISTINCT s
     SKIP $querySkip
     LIMIT $queryLimit`,
    { userId, querySkip, queryLimit },
  );

  const friends = friendSuggestionsRequest.records.map((s) =>
    filterUser(s.get("s").properties),
  );
  return friends;
}

export async function getFriendSuggestionsCount(
  session: Session,
  userId: string,
): Promise<neo4j.Integer | null> {
  const user = await getUser(session, { id: userId });
  if (!user) {
    return null;
  }

  const friendRequestsCountRequest = await session.run(
    `MATCH (u:User {id: $userId})-[:IS_FRIENDS_WITH]-(f:User)-[:IS_FRIENDS_WITH]-(s:User)
     WHERE NOT (u)-[:IS_FRIENDS_WITH]-(s) AND s.id <> $userId
     RETURN count(DISTINCT s)`,
    { userId },
  );

  const friendRequestsCount = friendRequestsCountRequest.records[0].get(0);
  return friendRequestsCount;
}

export type CheckFriendsResult = {
  firstUserExists: boolean;
  secondUserExists: boolean;
  areFriends: boolean;
};

export async function checkFriends(
  session: Session,
  userId1: string,
  userId2: string,
): Promise<CheckFriendsResult> {
  const firstUser = await getUser(session, { id: userId1 });
  const secondUser = await getUser(session, { id: userId2 });

  const firstUserExists = firstUser !== null;
  const secondUserExists = secondUser !== null;

  if (!firstUserExists || !secondUserExists) {
    return { firstUserExists, secondUserExists, areFriends: false };
  }

  const areFriends = await isFriend(session, userId1, userId2);
  return { firstUserExists, secondUserExists, areFriends };
}

export type SendFriendInviteResult = {
  success: boolean;
  firstUserExists: boolean;
  secondUserExists: boolean;
};

export async function sendFriendRequest(
  session: Session,
  userId1: string,
  userId2: string,
): Promise<SendFriendInviteResult> {
  const { firstUserExists, secondUserExists, areFriends } = await checkFriends(
    session,
    userId1,
    userId2,
  );
  const sameId = userId1 == userId2;

  const success = firstUserExists && secondUserExists && !areFriends && !sameId;
  if (!success) {
    return { success, firstUserExists, secondUserExists };
  }

  await session.run(
    `MATCH (a:User {id: $userId1}), (b:User {id: $userId2})
     MERGE (a)-[:SENT_INVITE_TO]->(b)`,
    { userId1, userId2 },
  );

  return { success, firstUserExists, secondUserExists };
}

export type AcceptFriendRequestResult = {
  success: boolean;
  firstUserExists: boolean;
  secondUserExists: boolean;
  sentInvite: boolean;
  alreadyFriends: boolean;
};

export async function acceptFriendRequest(
  session: Session,
  userId1: string,
  userId2: string,
): Promise<AcceptFriendRequestResult> {
  const {
    firstUserExists,
    secondUserExists,
    areFriends: alreadyFriends,
  } = await checkFriends(session, userId1, userId2);

  if (!firstUserExists || !secondUserExists || alreadyFriends) {
    return {
      success: false,
      firstUserExists,
      secondUserExists,
      sentInvite: false,
      alreadyFriends,
    };
  }

  const acceptInviteRequest = await session.run(
    `MATCH (u1:User {id: $userId1})<-[r:SENT_INVITE_TO]-(u2:User {id: $userId2})
     DELETE r
     CREATE (u1)-[:IS_FRIENDS_WITH]->(u2)
     RETURN true`,
    { userId1, userId2 },
  );

  const records = acceptInviteRequest.records;
  const sentInvite = records.length > 0;

  return {
    success: sentInvite,
    firstUserExists,
    secondUserExists,
    sentInvite,
    alreadyFriends,
  };
}

export async function addFriend(
  session: Session,
  userId1: string,
  userId2: string,
) {
  await session.run(
    `MATCH (u1:User {id: $userId1}), (u2:User {id: $userId2})
     MERGE (u1)-[:IS_FRIENDS_WITH]-(u2)
     RETURN true`,
    { userId1, userId2 },
  );
}

export type DeclineFriendRequestResult = {
  success: boolean;
  firstUserExists: boolean;
  secondUserExists: boolean;
  wasFriend: boolean;
  wasInvited: boolean;
};

export async function declineFriendRequest(
  session: Session,
  userId1: string,
  userId2: string,
): Promise<DeclineFriendRequestResult> {
  const {
    firstUserExists,
    secondUserExists,
    areFriends: wasFriend,
  } = await checkFriends(session, userId1, userId2);

  if (!firstUserExists || !secondUserExists || wasFriend) {
    return {
      success: false,
      firstUserExists,
      secondUserExists,
      wasFriend,
      wasInvited: false,
    };
  }

  const acceptInviteRequest = await session.run(
    `MATCH (u1)<-[r:SENT_INVITE_TO]->(u2)
     DELETE r
     RETURN true`,
    { userId1, userId2 },
  );

  const wasInvited = acceptInviteRequest.records.length > 0;

  return {
    success: wasInvited,
    firstUserExists,
    secondUserExists,
    wasFriend,
    wasInvited,
  };
}

export type DeleteFriendResult = {
  success: boolean;
  firstUserExists: boolean;
  secondUserExists: boolean;
  wasFriend: boolean;
};

export async function deleteFriend(
  session: Session,
  userId1: string,
  userId2: string,
): Promise<DeleteFriendResult> {
  const {
    firstUserExists,
    secondUserExists,
    areFriends: wasFriend,
  } = await checkFriends(session, userId1, userId2);

  if (!firstUserExists || !secondUserExists || !wasFriend) {
    return {
      success: false,
      firstUserExists,
      secondUserExists,
      wasFriend: false,
    };
  }

  await session.run(
    `MATCH (u1:User {id: $userId1})-[r:IS_FRIENDS_WITH]-(u2:User {id: $userId2})
     DELETE r
     RETURN true`,
    { userId1, userId2 },
  );

  return {
    success: true,
    firstUserExists,
    secondUserExists,
    wasFriend,
  };
}
