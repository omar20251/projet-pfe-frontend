import { useState } from 'react';
import { Plus, Edit, Trash, Copy, Eye, Search, FileText } from 'lucide-react';
// import { mockTests } from '../../mocks/testMocks'; // Removed mock data
import { Test } from '../../types';

const TestManagement = () => {
  const [tests, setTests] = useState<Test[]>([]); // TODO: Load from API
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const filteredTests = tests.filter(test => 
    test.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteTest = (id: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      setTests(tests.filter(test => test.id !== id));
    }
  };

  const duplicateTest = (test: Test) => {
    const newTest = {
      ...test,
      id: Date.now().toString(),
      titre: `${test.titre} (Copy)`
    };
    setTests([...tests, newTest]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Test Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 flex items-center bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Test
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search tests by title or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Tests</h2>
        </div>
        
        {filteredTests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTests.map(test => (
              <div key={test.id} className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-blue-50 text-blue-700">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{test.titre}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="font-medium">Category:</span>
                          <span className="ml-1">{test.categorie}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Duration:</span>
                          <span className="ml-1">{test.dureeMinutes} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Questions:</span>
                          <span className="ml-1">{test.questions.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => duplicateTest(test)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 flex items-center hover:bg-gray-50"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </button>
                    <button 
                      onClick={() => deleteTest(test.id)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-red-600 flex items-center hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {test.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {test.questions.filter(q => q.type === 'single').length} Single Choice
                  </div>
                  <div className="px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    {test.questions.filter(q => q.type === 'multiple').length} Multiple Choice
                  </div>
                  <div className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    {test.questions.filter(q => q.type === 'text').length} Text Answer
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="rounded-full h-12 w-12 bg-blue-100 flex items-center justify-center mx-auto">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No tests match your search criteria.' : 'Get started by creating a new test.'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Test
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Test Modal - In a real app, this would be a separate component */}
      {showCreateModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Create New Test
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="test-title" className="block text-sm font-medium text-gray-700">
                          Test Title
                        </label>
                        <input
                          type="text"
                          id="test-title"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., JavaScript Developer Assessment"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="test-category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          id="test-category"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select Category</option>
                          <option value="web-development">Web Development</option>
                          <option value="mobile-development">Mobile Development</option>
                          <option value="data-science">Data Science</option>
                          <option value="design">Design</option>
                          <option value="soft-skills">Soft Skills</option>
                          <option value="language">Language Proficiency</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="test-duration" className="block text-sm font-medium text-gray-700">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          id="test-duration"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          min="1"
                          placeholder="e.g., 30"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="test-description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="test-description"
                          rows={3}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Describe what this test is designed to assess"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Continue to Questions
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;