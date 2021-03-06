package com.vsquaresystem.safedeals.amenity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.vsquaresystem.safedeals.user.User;
import com.vsquaresystem.safedeals.user.UserDAL;
import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/amenity")
public class AmenityRest {

    private Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private AmenityDAL amenityDal;

    @Autowired
    private UserDAL userDAL;

    @Autowired
    private AmenityService amenityService;

    @RequestMapping(method = RequestMethod.GET)
    public List<Amenity> findAll(
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {
        return amenityDal.findAll(offset);

    }

    @RequestMapping(value = "/amenities", method = RequestMethod.GET)
    public List<Amenity> findAllAmenities() {
        return amenityDal.findAllAmenities();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Amenity findById(@PathVariable("id") Integer id) {
        return amenityDal.findById(id);
    }

    @RequestMapping(value = "/find/amenity_like", method = RequestMethod.GET)
    public List<Amenity> findByNameLike(@RequestParam("name") String name) {
        return amenityDal.findByNameLike(name);
    }

    @RequestMapping(value = "/find_by_amenity_code", method = RequestMethod.GET)
    public List<Amenity> findByAmenityCode(@RequestParam("amenityCodeId") Integer amenityCodeId) {
        return amenityDal.findByAmenityCode(amenityCodeId);
    }

    @RequestMapping(value = "/find/amenity_code_and_amenity_name_like", method = RequestMethod.GET)
    public List<Amenity> findByAmenityCodeAndAmenityNameLike(
            @RequestParam("amenityCodeId") Integer amenityCodeId,
            @RequestParam("name") String name) {
        return amenityDal.findByAmenityCodeAndAmenityNameLike(amenityCodeId, name);
    }

    @RequestMapping(value = "/find/amenity_name", method = RequestMethod.GET)
    public Amenity findByAmenityName(@RequestParam("name") String name) {
        return amenityDal.findByAmenityName(name);
    }

    @RequestMapping(method = RequestMethod.POST)
    public Amenity insert(@RequestBody Amenity amenity,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User currentUser) throws JsonProcessingException {
        User user = userDAL.findByUsername(currentUser.getUsername());
        amenity.setUserId(user.getId());
        logger.info("Amenity  REST :{}", amenity);
        return amenityDal.insert(amenity);
    }

    @RequestMapping(value = "/find/name", method = RequestMethod.GET)
    public List<Amenity> findByName(@RequestParam("name") String name) {
        return amenityDal.findByName(name);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Integer id,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User currentUser) throws JsonProcessingException {
        User user = userDAL.findByUsername(currentUser.getUsername());
        amenityDal.delete(id, user.getId());
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.POST)
    public Amenity update(@RequestBody Amenity amenity,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User currentUser) throws JsonProcessingException {
        User user = userDAL.findByUsername(currentUser.getUsername());
        amenity.setUserId(user.getId());
        return amenityDal.update(amenity);
    }

    @RequestMapping(value = "/export", method = RequestMethod.POST)
    public Boolean exportAllAmenities() throws IOException {
        logger.info("exportExcelData EXCEL DATA {}");
        return amenityService.exportExcel();
    }
}
