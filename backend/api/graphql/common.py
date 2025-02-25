USER_EVENT_CHANNEL = "user-events"


def get_room_users_prefix(room_id):
    return f"room::{room_id}"


def get_room_users_key(room_id, user_id):
    return f"{get_room_users_prefix(room_id)}::user::{user_id}"


def get_user_events_channel(room_id):
    return f"{USER_EVENT_CHANNEL}::room:{room_id}"
