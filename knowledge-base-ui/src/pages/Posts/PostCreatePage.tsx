import { useNavigate } from 'react-router-dom';
import { PostDocument } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { PostForm } from '../../components/posts/PostForm';
import { useResource } from '../../hooks/useResource';
import { postsConfig } from '../../features/posts/posts.config';

export default function PostCreatePage() {
  const navigate = useNavigate();

  const { create, checkTitleExists } = useResource<PostDocument>(postsConfig);

  const handleSubmit = async (data: Partial<PostDocument>) => {
    if (!data.title) {
      throw new Error('Le titre est requis.');
    }

    const exists = await checkTitleExists(data.title);
    if (exists) {
      throw new Error('Un post avec ce titre existe déjà.');
    }

    try {
      await create(data);
      navigate('/post');
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  return (
    <ResourceView
      config={postsConfig}
      mode="create"
      FormComponent={PostForm}
      onSubmit={handleSubmit}
      listPath="/post"
    />
  );
}
