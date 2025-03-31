'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { handleFileUpload } from "@/utils/fileUpload";
import ProfileImage from "@/components/ProfileImage"
import { useAuth } from '@/hooks/useAuth';

export default function ProfileContent() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    profileImage: user?.profileImage || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleProfileUpdate } = useAuth();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        const svgString: string = await handleFileUpload(event);
        setEditedUser(prev => ({ ...prev, profileImage: svgString }));
      } catch (error) {
        console.error("파일 변환 중 오류 발생:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // API 호출 로직 추가 예정
      setIsEditing(false);
      await handleProfileUpdate(`${user?.id}`, editedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


	useEffect(() => {
    //수정모드 진입해서 값을 수정하고나서 저장 안누르고 취소한경우 초기화
    setEditedUser({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      profileImage: user?.profileImage || ''
    });
	}, [isEditing]);





  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-[#FEE500] p-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">내 프로필</h1>
          </div>

          {/* 프로필 컨텐츠 */}
          <div className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* 프로필 이미지 */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FEE500]">
                  {editedUser.profileImage ? (

                  <ProfileImage
                    svgString={editedUser.profileImage || ""}
                    alt={editedUser.username}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl text-gray-400">👤</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* 프로필 정보 */}
              <div className="w-full max-w-md">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        사용자명
                      </label>
                      <input
                        type="text"
                        value={editedUser.username}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        value={editedUser.password}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="변경하려면 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:border-transparent text-gray-800"
                        required
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2 px-4 bg-[#FEE500] text-gray-800 font-medium rounded-md hover:bg-[#FDD800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500] disabled:opacity-50"
                      >
                        {isLoading ? '저장 중...' : '저장'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-sm font-medium text-gray-500">사용자명</h3>
                      <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-sm font-medium text-gray-500">이메일</h3>
                      <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2 px-4 bg-[#FEE500] text-gray-800 font-medium rounded-md hover:bg-[#FDD800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500]"
                    >
                      프로필 수정
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 