import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Send } from 'lucide-react';
import API from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const steps = ['Service', 'Options', 'Date & time', 'Event', 'Your details', 'Review'];

export const Booking = () => {
  const [params] = useSearchParams();
  const [services, setServices] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    service: null,
    subServices: [],
    package: null,
    selections: [],
    addOns: [],
    event: {
      date: '',
      alternateDate: '',
      startTime: '',
      endTime: '',
      location: '',
      city: '',
      guestCount: '',
      budget: '',
      notes: '',
    },
    customer: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
    },
  });

  useEffect(() => {
    API.get('/services')
      .then((response) => {
        const loadedServices = response.data || [];
        setServices(loadedServices);

        const wanted = params.get('category');
        if (wanted) {
          const found = loadedServices.find(
            (service) =>
              service.slug === wanted ||
              service.name.toLowerCase().replace(/\s+/g, '-') === wanted
          );
          if (found) {
            setForm((current) => ({
              ...current,
              service: found,
              subServices: [],
              selections: [],
              addOns: [],
            }));
          }
        }
      })
      .catch(() => setError('Could not load booking services.'))
      .finally(() => setLoading(false));
  }, [params]);

  const availableSubServices = form.service?.subServices || [];
  const getSubServiceKey = (subService) => subService?._id || subService?.name;

  const selectedSubServiceIds = useMemo(
    () => new Set(form.subServices.map((service) => getSubServiceKey(service))),
    [form.subServices]
  );
  const selectedKeys = useMemo(
    () => new Set(form.selections.map((item) => `${item.subServiceId || ''}:${item.group}:${item.name}`)),
    [form.selections]
  );

  const toggleSubService = (subService) => {
    setForm((current) => {
      const serviceKey = getSubServiceKey(subService);
      const exists = current.subServices.some((item) => getSubServiceKey(item) === serviceKey);

      if (exists) {
        return {
          ...current,
          subServices: current.subServices.filter(
            (item) => getSubServiceKey(item) !== serviceKey
          ),
          selections: current.selections.filter(
            (item) => item.subServiceId !== serviceKey
          ),
        };
      }

      return {
        ...current,
        subServices: [...current.subServices, subService],
      };
    });
  };

  const toggleOption = (subService, group, option) => {
    const key = `${getSubServiceKey(subService)}:${group.name}:${option.name}`;

    setForm((current) => {
      const exists = current.selections.some(
        (item) => `${item.subServiceId || ''}:${item.group}:${item.name}` === key
      );

      if (group.type === 'single') {
        return {
          ...current,
          selections: [
            ...current.selections.filter(
              (item) =>
                !(
                  item.subServiceId === getSubServiceKey(subService) &&
                  item.group === group.name
                )
            ),
            {
              subServiceId: getSubServiceKey(subService),
              subServiceName: subService.name,
              group: group.name,
              name: option.name,
              value: option.name,
            },
          ],
        };
      }

      return {
        ...current,
        selections: exists
          ? current.selections.filter(
              (item) =>
                `${item.subServiceId || ''}:${item.group}:${item.name}` !== key
            )
          : [
              ...current.selections,
              {
                subServiceId: getSubServiceKey(subService),
                subServiceName: subService.name,
                group: group.name,
                name: option.name,
                value: option.name,
              },
            ],
      };
    });
  };

  const toggleAddOn = (option) => {
    setForm((current) => {
      const exists = current.addOns.some((item) => item.name === option.name);
      return {
        ...current,
        addOns: exists
          ? current.addOns.filter((item) => item.name !== option.name)
          : [...current.addOns, { group: 'Add-on', name: option.name, value: option.name }],
      };
    });
  };

  const isOptionSelected = (subService, group, option) =>
    selectedKeys.has(`${getSubServiceKey(subService)}:${group.name}:${option.name}`);

  const valid = () => {
    if (step === 0) {
      return !!form.service && form.subServices.length > 0;
    }
    if (step === 2) {
      return !!form.event.date && !!form.event.startTime && !!form.event.endTime;
    }
    if (step === 4) {
      return (
        !!form.customer.name &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer.email) &&
        !!form.customer.phone
      );
    }
    return true;
  };

  const next = () => {
    setError('');
    if (!valid()) {
      setError(
        step === 0
          ? 'Select at least one service before continuing.'
          : 'Please complete the required fields.'
      );
      return;
    }
    setStep((current) => Math.min(5, current + 1));
  };

  const submit = async () => {
    setError('');
    if (!valid()) {
      setError('Please complete the required fields.');
      return;
    }

    setBusy(true);
    try {
      const payload = {
        ...form,
        // Keep the first selected service as a backwards-compatible primary value
        // while the full selection is stored in subServices.
        subService: form.subServices[0]
          ? {
              subServiceId: getSubServiceKey(form.subServices[0]),
              name: form.subServices[0].name,
            }
          : null,
        subServices: form.subServices.map((item) => ({
          subServiceId: getSubServiceKey(item),
          name: item.name,
        })),
      };

      const response = await API.post('/bookings', payload);
      setDone(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.msg || 'Could not submit booking request.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="endless-page">
        <Navbar />
        <main className="endless-shell py-24 text-center">Loading booking options…</main>
      </div>
    );
  }

  if (done) {
    return (
      <div className="endless-page">
        <Navbar />
        <main className="endless-shell py-20 min-h-[70vh] grid place-items-center">
          <div className="max-w-xl text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#d7a26d] grid place-items-center">
              <Check />
            </div>
            <p className="text-[10px] uppercase tracking-[.3em] text-[#9a6845] font-bold mt-7">
              Request received
            </p>
            <h1 className="endless-serif text-5xl mt-3">
              Your date is in the studio queue.
            </h1>
            <p className="text-[#77766f] leading-7 mt-5">
              Reference <strong>{done.bookingId}</strong>.{' '}
              {done.conflict
                ? 'The requested slot already has activity, so our team will review the possibility and contact you.'
                : 'Our team will review your request and contact you with confirmation or the next step.'}
            </p>
            <Link
              to="/"
              className="inline-flex mt-8 rounded-full bg-[#1f211e] text-white px-6 py-3 font-bold"
            >
              Back to ENDLESS Moments
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="endless-page">
      <Navbar />
      <main className="endless-shell py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex gap-2 items-center text-xs font-bold text-[#77766f]">
            <ArrowLeft size={15} /> Back
          </Link>

          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[.35em] text-[#9a6845] font-bold">
              ENDLESS Moments booking
            </p>
            <h1 className="endless-serif text-5xl sm:text-7xl leading-[.9] mt-3">
              Build your session.
            </h1>
            <p className="text-[#77766f] mt-5 max-w-2xl leading-7">
              Choose exactly what you need. If another booking already occupies your preferred
              time, you can still request it and the studio will check whether the team can
              accommodate you.
            </p>
          </div>

          <div className="flex overflow-auto gap-2 mt-10 pb-2">
            {steps.map((label, index) => (
              <div
                key={label}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold ${
                  index === step
                    ? 'bg-[#1f211e] text-white'
                    : 'bg-[#ebe5db] text-[#77766f]'
                }`}
              >
                {index + 1}. {label}
              </div>
            ))}
          </div>

          <section className="endless-card rounded-[2rem] p-5 sm:p-9 mt-5">
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-extrabold">What are you planning?</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                  {services.map((service) => (
                    <button
                      type="button"
                      key={service._id}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          service,
                          subServices: [],
                          package: null,
                          selections: [],
                          addOns: [],
                        }))
                      }
                      className={`text-left rounded-2xl border p-5 transition ${
                        form.service?._id === service._id
                          ? 'border-[#9a6845] bg-[#f4eadf]'
                          : 'border-[#ded8cd] bg-[#fffdf9] hover:border-[#bda487]'
                      }`}
                    >
                      <p className="font-bold">{service.name}</p>
                      <p className="text-sm text-[#77766f] mt-2 leading-6">
                        {service.description}
                      </p>
                    </button>
                  ))}
                </div>

                {form.service && (
                  <div className="mt-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                      <div>
                        <h3 className="font-bold">Choose services within {form.service.name}</h3>
                        <p className="text-sm text-[#77766f] mt-1">
                          Select one or more. You do not need to select them one at a time.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#9a6845]">
                        {form.subServices.length} selected
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                      {availableSubServices.map((subService) => {
                        const selected = selectedSubServiceIds.has(subService._id);
                        return (
                          <button
                            type="button"
                            key={getSubServiceKey(subService)}
                            aria-pressed={selected}
                            onClick={() => toggleSubService(subService)}
                            className={`text-left rounded-xl border p-4 transition flex items-center gap-3 ${
                              selected
                                ? 'border-[#9a6845] bg-[#f4eadf]'
                                : 'border-[#ded8cd] bg-[#fffdf9] hover:border-[#bda487]'
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`w-5 h-5 shrink-0 rounded border grid place-items-center ${
                                selected
                                  ? 'bg-[#1f211e] border-[#1f211e] text-white'
                                  : 'border-[#bdb5a8] bg-white'
                              }`}
                            >
                              {selected ? <Check size={13} /> : null}
                            </span>
                            <span className="font-semibold">{subService.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-extrabold">Customize your request</h2>
                <p className="text-sm text-[#77766f] mt-2">
                  Options for all selected services are shown below. Each option group keeps its
                  own selection rules.
                </p>

                <div className="space-y-8 mt-7">
                  {form.subServices.map((subService) => (
                    <div key={getSubServiceKey(subService)} className="rounded-2xl border border-[#ded8cd] p-5">
                      <h3 className="font-bold text-lg">{subService.name}</h3>

                      {(subService.optionGroups || []).length === 0 && (
                        <p className="text-sm text-[#77766f] mt-2">
                          No additional options are configured for this service.
                        </p>
                      )}

                      <div className="space-y-6 mt-4">
                        {(subService.optionGroups || []).map((group) => (
                          <div key={`${getSubServiceKey(subService)}-${group.name}`}>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold">{group.name}</h4>
                              <span className="text-[10px] uppercase tracking-wider text-[#9a6845] font-bold">
                                {group.type === 'single' ? 'Choose one' : 'Choose any'}
                              </span>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                              {(group.options || []).map((option) => {
                                const selected = isOptionSelected(subService, group, option);
                                return (
                                  <label
                                    key={option._id}
                                    className={`flex gap-3 items-center rounded-xl border p-4 cursor-pointer transition ${
                                      selected
                                        ? 'border-[#9a6845] bg-[#f4eadf]'
                                        : 'border-[#ded8cd] bg-[#fffdf9]'
                                    }`}
                                  >
                                    <input
                                      type={group.type === 'single' ? 'radio' : 'checkbox'}
                                      name={
                                        group.type === 'single'
                                          ? `${getSubServiceKey(subService)}-${group.name}`
                                          : undefined
                                      }
                                      checked={selected}
                                      onChange={() => toggleOption(subService, group, option)}
                                    />
                                    <span className="text-sm font-semibold">{option.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {(form.service?.addOns || []).length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg">Add-ons</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                        {form.service.addOns.map((option) => {
                          const selected = form.addOns.some((item) => item.name === option.name);
                          return (
                            <label
                              key={option._id}
                              className={`flex gap-3 items-center rounded-xl border p-4 cursor-pointer transition ${
                                selected
                                  ? 'border-[#9a6845] bg-[#f4eadf]'
                                  : 'border-[#ded8cd] bg-[#fffdf9]'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleAddOn(option)}
                              />
                              <span className="text-sm font-semibold">{option.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-extrabold">Preferred date & time</h2>
                <p className="text-sm text-[#77766f] mt-2">
                  A busy slot can still be requested; the studio will review capacity.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-7">
                  <Field label="Preferred date">
                    <input
                      type="date"
                      value={form.event.date}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          event: { ...current.event, date: event.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Alternate date">
                    <input
                      type="date"
                      value={form.event.alternateDate}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          event: { ...current.event, alternateDate: event.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Start time">
                    <input
                      type="time"
                      value={form.event.startTime}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          event: { ...current.event, startTime: event.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="End time">
                    <input
                      type="time"
                      value={form.event.endTime}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          event: { ...current.event, endTime: event.target.value },
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-extrabold">Tell us about the event</h2>
                <div className="grid sm:grid-cols-2 gap-4 mt-7">
                  <Field label="Venue / location">
                    <input
                      value={form.event.location}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          event: { ...current.event, location: event.target.value },
                        }))
                      }
                      placeholder="Venue or location"
                    />
                  </Field>
                  <Field label="City">
                    <input
                      value={form.event.city}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          event: { ...current.event, city: event.target.value },
                        }))
                      }
                      placeholder="City"
                    />
                  </Field>
                  <Field label="Guest count">
                    <input
                      value={form.event.guestCount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          event: { ...current.event, guestCount: event.target.value },
                        }))
                      }
                      placeholder="Approx. people"
                    />
                  </Field>
                  <Field label="Budget (optional)">
                    <input
                      value={form.event.budget}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          event: { ...current.event, budget: event.target.value },
                        }))
                      }
                      placeholder="Budget range"
                    />
                  </Field>
                </div>
                <Field label="Additional requirements">
                  <textarea
                    rows="6"
                    value={form.event.notes}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        event: { ...current.event, notes: event.target.value },
                      }))
                    }
                    placeholder="Tell the studio anything important…"
                  />
                </Field>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-extrabold">How should we contact you?</h2>
                <div className="grid sm:grid-cols-2 gap-4 mt-7">
                  <Field label="Full name">
                    <input
                      value={form.customer.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          customer: { ...current.customer, name: event.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      value={form.customer.email}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          customer: { ...current.customer, email: event.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      value={form.customer.phone}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          customer: { ...current.customer, phone: event.target.value },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Alternate phone">
                    <input
                      value={form.customer.alternatePhone}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          customer: { ...current.customer, alternatePhone: event.target.value },
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-2xl font-extrabold">Review your request</h2>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  <Review label="Category" value={form.service?.name || '—'} />
                  <Review
                    label="Selected services"
                    value={form.subServices.map((item) => item.name).join(', ') || '—'}
                  />
                  <Review
                    label="Date"
                    value={`${form.event.date} · ${form.event.startTime}–${form.event.endTime}`}
                  />
                  <Review
                    label="Customer"
                    value={`${form.customer.name} · ${form.customer.phone}`}
                  />
                  <Review
                    label="Location"
                    value={`${form.event.location || 'Not specified'}${
                      form.event.city ? `, ${form.event.city}` : ''
                    }`}
                  />
                </div>

                <div className="mt-4 rounded-2xl bg-[#eee8de] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider">Selections</p>
                  <p className="text-sm mt-2">
                    {form.selections.map((item) => `${item.subServiceName}: ${item.name}`).join(', ') ||
                      'No extra options selected'}
                    {form.addOns.length
                      ? ` · Add-ons: ${form.addOns.map((item) => item.name).join(', ')}`
                      : ''}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 text-red-700 p-4 text-sm">{error}</div>
            )}

            <div className="flex justify-between gap-3 mt-9 pt-6 border-t border-[#ded8cd]">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={step === 0 || busy}
                className="rounded-full border border-[#d9d2c6] px-5 py-3 text-sm font-bold disabled:opacity-40"
              >
                Back
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-full bg-[#1f211e] text-white px-6 py-3 text-sm font-bold flex items-center gap-2"
                >
                  Continue <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={busy}
                  className="rounded-full bg-[#1f211e] text-white px-6 py-3 text-sm font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {busy ? 'Submitting…' : 'Submit booking request'} <Send size={15} />
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block sm:col-span-1 mb-4">
    <span className="block text-[10px] uppercase tracking-[.2em] font-bold text-[#77766f] mb-2">
      {label}
    </span>
    {React.cloneElement(children, {
      className:
        'w-full rounded-xl border border-[#d9d2c6] bg-[#fffdf9] px-4 py-3.5 text-sm outline-none focus:border-[#9a6845]',
    })}
  </label>
);

const Review = ({ label, value }) => (
  <div className="rounded-xl border border-[#ded8cd] p-4">
    <p className="text-[10px] uppercase tracking-wider text-[#9a6845] font-bold">{label}</p>
    <p className="text-sm font-semibold mt-2">{value}</p>
  </div>
);
