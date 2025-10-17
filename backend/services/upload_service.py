from services.supabase_client import supabase

async def upload_to_supabase_storage(file, user_id: str):
    file_bytes = await file.read()

    file_path = f"{user_id}/{file.filename}"

    response = supabase.storage.from_('uploads').upload(file_path, file_bytes)

    if not response:
        raise Exception(response["error"]["message"])
    
    public_url = supabase.storage.from_('uploads').get_public_url(file_path)
    return public_url