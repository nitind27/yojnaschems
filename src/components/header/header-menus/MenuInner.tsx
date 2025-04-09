import { KTIcon } from "@/_metronic/helpers";

export function MenuInner() {
  return (
    <>
      <style>
        {`
          .search-input:focus {
            background-color: #E9E9E9; /* Equivalent to bg-gray-300 */
          }
        `}
      </style>
      {/* <form
        data-kt-search-element="form"
        className="d-md-flex d-none   align-items-center border-0 position-relative my-1"
        autoComplete="off"
      >
        <KTIcon
          iconName="magnifier"
          iconType="duotone"
          className="fs-3 d-none d-lg-flex position-absolute ms-5"
        />
        <input
          type="text"
          className="form-control border-0 bg-transparent d-none d-lg-flex form-control-solid bg-gray-500 w-400px ps-13 search-input"
          name="search"
          placeholder="Search"
          data-kt-search-element="input"
        />
      </form> */}

      
    </>
  );
}