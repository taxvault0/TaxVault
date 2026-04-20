import React, { useState } from 'react';
import {
  Percent,
  Calendar,
  Download,
  Send,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const GSTDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2024);

  const gstData = {
    gstNumber: '123456789RT0001',
    filingFrequency: 'quarterly',
    nextFilingDate: '2024-04-30',
    lastFiledDate: '2024-01-31',
    collectedYTD: 1250.75,
    paidYTD: 450.5,
    netPayable: 800.25,
    quarters: [
      {
        period: 'Q1 2024',
        collected: 1250.75,
        paid: 450.5,
        status: 'pending',
        dueDate: '2024-04-30',
      },
      {
        period: 'Q4 2023',
        collected: 980.25,
        paid: 320.75,
        status: 'filed',
        filedDate: '2024-01-15',
      },
      {
        period: 'Q3 2023',
        collected: 1120.5,
        paid: 380.25,
        status: 'filed',
        filedDate: '2023-10-12',
      },
      {
        period: 'Q2 2023',
        collected: 1050.3,
        paid: 340.2,
        status: 'filed',
        filedDate: '2023-07-18',
      },
    ],
  };

  const years = [2024, 2023, 2022, 2021];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GST/HST Dashboard</h1>
          <p className="mt-1 text-gray-500">Track and file your GST/HST returns</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <Send size={16} className="mr-2" />
            File Return
          </Button>
        </div>
      </div>

      {/* Year selector */}
      <div className="flex flex-wrap items-center gap-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              selectedYear === year
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Top summary */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card className="border-primary-200 bg-primary-50">
            <Card.Body>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-lg bg-primary-100 p-3">
                    <Percent className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">GST/HST Number</p>
                    <p className="text-xl font-bold text-primary-600">
                      {gstData.gstNumber}
                    </p>
                  </div>
                </div>

                <Badge variant="success">Active</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">Filing Frequency</p>
                  <p className="font-medium capitalize">{gstData.filingFrequency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next Filing</p>
                  <p className="font-medium text-warning-600">
                    {gstData.nextFilingDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Filed</p>
                  <p className="font-medium">{gstData.lastFiledDate}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="font-semibold">Quarterly Breakdown</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {gstData.quarters.map((quarter) => (
                  <div
                    key={quarter.period}
                    className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2 text-gray-400" />
                        <h4 className="font-medium">{quarter.period}</h4>
                      </div>
                      <Badge
                        variant={quarter.status === 'filed' ? 'success' : 'warning'}
                      >
                        {quarter.status}
                      </Badge>
                    </div>

                    <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-gray-500">Collected</p>
                        <p className="font-semibold">
                          ${quarter.collected.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ITCs</p>
                        <p className="font-semibold">${quarter.paid.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Net</p>
                        <p className="font-semibold text-warning-600">
                          ${(quarter.collected - quarter.paid).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {quarter.status === 'pending' ? (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center text-warning-600">
                          <Clock size={16} className="mr-1" />
                          <span className="text-sm">Due: {quarter.dueDate}</span>
                        </div>
                        <Button size="sm">File Now</Button>
                      </div>
                    ) : (
                      <div className="flex items-center text-success-600">
                        <CheckCircle size={16} className="mr-1" />
                        <span className="text-sm">Filed on {quarter.filedDate}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Right utility rail */}
        <div className="space-y-6 xl:col-span-4">
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">GST Collected (YTD)</p>
              <p className="mt-1 text-2xl font-bold text-success-600">
                ${gstData.collectedYTD.toFixed(2)}
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">ITCs Claimed (YTD)</p>
              <p className="mt-1 text-2xl font-bold text-info-600">
                ${gstData.paidYTD.toFixed(2)}
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Net Payable (YTD)</p>
              <p className="mt-1 text-2xl font-bold text-warning-600">
                ${gstData.netPayable.toFixed(2)}
              </p>
            </Card.Body>
          </Card>

          <Card className="border-info-200 bg-info-50">
            <Card.Body>
              <div className="flex items-start">
                <AlertCircle
                  className="mr-3 mt-1 flex-shrink-0 text-info-600"
                  size={20}
                />
                <div>
                  <h4 className="font-medium text-info-700">
                    GST/HST Filing Requirements
                  </h4>
                  <p className="mt-1 text-sm text-info-600">
                    As a gig worker, you must file GST/HST returns quarterly if
                    you&apos;re registered. Returns are due within one month after
                    the end of each quarter.
                  </p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-sm font-medium text-info-700 hover:underline"
                  >
                    Learn more on CRA website
                    <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GSTDashboard;

