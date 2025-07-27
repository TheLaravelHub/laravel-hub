import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import InputError from '@/components/input-error';
import InputLabel from '@/components/input-label';
import PrimaryButton from '@/components/primary-button';
import TextInput from '@/components/text-input';
import { PageProps } from '@/types';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

interface CreateProps extends PageProps {}

export default function Create({ auth, flash }: CreateProps & { flash: { success?: string } }) {
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    repository_url: '',
  });

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
      console.log('Toast triggered from flash:', flash.success);
    }
  }, [flash]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('user.packages.store'), {
      onSuccess: () => {
        // Direct toast call that should work regardless of flash messages
        toast.success('Your package has been submitted for review!');
        console.log('Toast triggered from onSuccess handler');
      },
    });
  };

  return (
    <UserLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Submit a Package
          </h2>
        </div>
      }
    >
      <Head title="Submit a Package" />

      <div className="grid grid-cols-1 gap-6 p-4">
        <div className="rounded-xl bg-white shadow">
          <div className="border-b border-border p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Package size={18} className="text-primary" />{' '}
              Submit Your Package
            </h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div>
                <InputLabel htmlFor="repository_url" value="GitHub Repository URL" />
                <TextInput
                  id="repository_url"
                  type="text"
                  className="mt-1 block w-full"
                  value={data.repository_url}
                  onChange={(e) => setData('repository_url', e.target.value)}
                  required
                  placeholder="https://github.com/username/repository"
                />
                <InputError message={errors.repository_url} className="mt-2" />
                <p className="mt-2 text-sm text-gray-500">Enter the full URL to your GitHub repository</p>
              </div>

              <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90">
                  Submit Package
                </PrimaryButton>

                <button
                  type="button"
                  onClick={() => toast.success('Test toast message')}
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  Test Toast
                </button>

                {recentlySuccessful && (
                  <p className="text-sm text-gray-600">Submitted successfully.</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
